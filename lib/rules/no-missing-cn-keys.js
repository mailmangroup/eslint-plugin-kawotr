'use strict';


const objectContainsTranslation = node => {

	const { properties } = node;

	return !!properties.filter( property => property.key.name === 'en' ).length;
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

		case 'CallExpression':
		case 'ArrayExpression':
		case 'Identifier':
		case 'ConditionalExpression':
		case 'MemberExpression':
		case 'LogicalExpression':
			value = nodeArgument.type;
			break;
	}

	return value;
};


const validateObject = ( context, node ) => {

	const { properties: props } = node;
	const translationsLookup = context.settings.translationsLookup;
	const allowedTypes = [
		'CallExpression', 'ArrayExpression', 'Identifier', 'ConditionalExpression',
		'MemberExpression', 'BinaryExpression', 'LogicalExpression'
	];

	let en = props.find( prop => prop.key.name === 'en' ),
		cn = props.find( prop => prop.key.name === 'cn' ),
		error = 0;

	en = en && getArgumentValue( context, en.value );
	cn = cn && getArgumentValue( context, cn.value );

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
			return `Missing Translation: Incorrect cn parameter: { en: ${en}, cn: ${cn} } `;

		case 2:
			return `Missing Translation: Identical en and cn parameters: { en: ${en}, cn: ${cn} } `;

		case 3:
			return `Missing Translation: cn parameter is filler content: { en: ${en}, cn: ${cn} } `;
	}
};


const create = context => {
	return {
		ObjectExpression( node ) {

			if ( !objectContainsTranslation( node ) ) return;

			const object = validateObject( context, node );

			// CALL WAS VALID › RETURN
			if ( !object.error ) return;

			context.report({
				node: object.node,
				message: errorMessage( object.error, object.en, object.cn )
			});
		}
	};
};


module.exports = {
	create,
	meta: {
		type: 'suggestion',
		docs: {
			url: 'https://github.com/fergusjordan/eslint-plugin-kawotr/blob/docs/rules/no-missing-cn-keys.md'
		},
		fixable: 'code'
	}
};