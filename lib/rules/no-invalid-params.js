'use strict';

const methodIsTr = node => {

	const { callee } = node;

	return (
		callee.type === 'MemberExpression' &&
		callee.object.type === 'Identifier' &&
		callee.object.name === 'kawo' &&
		callee.property.type === 'Identifier' &&
		callee.property.name === 'tr'
	);
};


const getArgumentValue = ( context, nodeArgument ) => {

	let value = null;

	if ( !nodeArgument ) return undefined;

	const sourceCode = context.getSourceCode();

	switch ( nodeArgument.type ) {

		case 'Literal':
			value = nodeArgument.value;
			break;

		case 'TemplateLiteral':
			value = sourceCode.getText( nodeArgument );
			break;

		case 'BinaryExpression':

			try {
				// TRY EVALUATE ANY CONCATENATED STRINGS
				value = eval( sourceCode.getText( nodeArgument ) );
			} catch ( e ) {
				// IN THE EVENT WERE CONCATENATING VARIABLES › MARK AS BINARY EXPRESSION
				value = 'BinaryExpression';
			}
			break;

		case 'Identifier':
		case 'ConditionalExpression':
		case 'MemberExpression':
			value = nodeArgument.type;
			break;
	}

	return value;
};


const validateCall = ( context, node ) => {

	const { arguments: args } = node;
	const translationsLookup = context.settings.translationsLookup;
	const allowedTypes = [ 'Identifier', 'ConditionalExpression', 'MemberExpression', 'BinaryExpression' ];

	let en = getArgumentValue( context, args[ 0 ] ),
		cn = getArgumentValue( context, args[ 1 ] ),
		error = 0;

	// IF CN NOT PASSED THROUGH TO CALL › RUN AGAINST COMMON TRANSLATIONS ON SETTINGS
	if ( en && ( cn === undefined || cn === 'MemberExpression' ) && typeof translationsLookup === 'function' )
		cn = translationsLookup( en, 'cn' ) || cn;

	// IF PASSED CALCULATED EXPRESSIONS OR VARIABLES › ASSUME CORRECT VALUE PASSED
	// (ALSO LET THROUGH IF NO CN VALUE GIVEN BUT EN IS BINARY OR MEMBER AND WE HAVE LOOKUP FUNCTION)
	if ( allowedTypes.includes( cn ) || !cn && allowedTypes.includes( en ) && typeof translationsLookup === 'function' )
		return { node, error: 0 };

	if ( cn === '' || cn === null || cn === undefined || cn === false ) error = 1;

	else if ( en === cn ) error = 2;

	else if ( cn.match( /^(中文)+$/ ) ) error = 3;

	return { en, cn, node, error };
};


const errorMessage = ( error, en, cn ) => {

	switch ( error ) {

		case 1:
			return `Missing Translation: Call to kawo.tr with an incorrect cn parameter: kawo.tr( ${en}, ${cn} )`;

		case 2:
			return `Missing Translation: Call to kawo.tr with identical en and cn parameters: kawo.tr( ${en}, ${cn} )`;

		case 3:
			return `Missing Translation: Call to kawo.tr with filler content: kawo.tr( ${en}, ${cn} )`;
	}
};


const create = context => {
	return {
		CallExpression( node ) {

			// NOT A CALL OF kawo.tr › RETURN
			if ( !methodIsTr( node ) ) return;

			const call = validateCall( context, node );

			// CALL WAS VALID › RETURN
			if ( !call.error ) return;

			context.report({
				node: call.node,
				message: errorMessage( call.error, call.en, call.cn )
			});
		}
	};
};


module.exports = {
	create,
	meta: {
		type: 'suggestion',
		docs: {
			url: 'https://github.com/fergusjordan/eslint-plugin-kawotr/blob/docs/rules/no-invalid-params.md'
		},
		fixable: 'code'
	}
};