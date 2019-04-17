'use strict';

const getArgumentValue = require( '../../utils/get-argument-value' );
const testValues = require( '../../utils/test-values' );

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


const validateCall = ( context, node ) => {

	const { arguments: args } = node;

	return testValues( context, {
		en: getArgumentValue( context, args[ 0 ] ),
		cn: getArgumentValue( context, args[ 1 ] ),
		node
	} );
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
				message: errorMessage( call.error, call.en, call.cn ),
				en: call.en
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