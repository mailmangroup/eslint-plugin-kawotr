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

	if ( nodeArgument.type === 'Literal' )
		value = nodeArgument.value;

	else if ( nodeArgument.type === 'TemplateLiteral' ) {

		const sourceCode = context.getSourceCode();

		value = sourceCode.getText( nodeArgument );
	}

	else if ( nodeArgument.type === 'MemberExpression' )
		value = 'MemberExpression';

	else if ( nodeArgument.type === 'BinaryExpression' )
		value = 'BinaryExpression';

	return value;
};


const validateCall = ( context, node ) => {

	const { arguments: args } = node;
	const translationsLookup = context.settings.translationsLookup;

	let en = getArgumentValue( context, args[ 0 ] ),
		cn = getArgumentValue( context, args[ 1 ] ),
		error = 0;

	// IF CN NOT PASSED THROUGH TO CALL › RUN AGAINST COMMON TRANSLATIONS ON SETTINGS
	if ( ( cn === undefined || cn === 'BinaryExpression' || cn === 'MemberExpression' ) && typeof translationsLookup === 'function' )
		cn = translationsLookup( en, 'cn' ) || cn;

	// IF PASSED A MEMBER EXPRESSION › ASSUME CORRECT VALUE PASSED
	if ( cn === 'MemberExpression' ) return { node, error: 0 };

	// IF PASSED A BINARY EXPRESSION › ASSUME CORRECT VALUE PASSED
	if ( cn === 'BinaryExpression' ) return { node, error: 0 };

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