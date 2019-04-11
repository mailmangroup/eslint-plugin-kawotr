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

	if ( nodeArgument.type === 'Literal' && typeof nodeArgument.value === 'string' )
		value = nodeArgument.value;

	else if ( nodeArgument.type === 'TemplateLiteral' ) {

		const sourceCode = context.getSourceCode();

		value = sourceCode.getText( nodeArgument );
	}

	return value;
};


const validateCall = ( context, node ) => {

	const { arguments: args } = node;
	const translationsLookup = context.settings.translationsLookup;

	let en = getArgumentValue( context, args[ 0 ] ),
		cn = getArgumentValue( context, args[ 1 ] ),
		error = 0;

	// IF CN NOT PASSED THROUGH TO CALL › RUN AGAINST COMMON TRANSLATIONS ON SETTINGS
	if ( cn === undefined && typeof translationsLookup === 'function' )
		cn = translationsLookup( en, 'cn' );

	if ( cn === '' ) error = 1;

	else if ( cn === null || cn === undefined || cn === false ) error = 2;

	else if ( en === cn ) error = 3;

	else if ( cn.match( /^(中文)+$/ ) ) error = 4;

	return { node, error };
};


const errorMessage = ( error ) => {

	switch ( error ) {

		case 1:
			return 'Missing Translation: Call to kawo.tr without an empty `cn` parameter';

		case 2:
			return 'Missing Translation: Call to kawo.tr with `null`, `false`, or `undefined` `cn` value';

		case 3:
			return 'Missing Translation: Call to kawo.tr with identical `en` and `cn` parameters';

		case 4:
			return 'Missing Translation: Call to kawo.tr with filler content';
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
				message: errorMessage( call.error )
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