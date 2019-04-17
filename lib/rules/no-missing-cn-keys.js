'use strict';

const getArgumentValue = require( '../../utils/get-argument-value' );
const testValues = require( '../../utils/test-values' );

const objectContainsTranslation = node => {

	const { properties } = node;

	return !!properties.filter( property => property.key.name === 'en' ).length;
};

const validateObject = ( context, node ) => {

	const { properties: props } = node;

	let en = props.find( prop => prop.key.name === 'en' ),
		cn = props.find( prop => prop.key.name === 'cn' );

	en = en && getArgumentValue( context, en.value );
	cn = cn && getArgumentValue( context, cn.value );

	return testValues( context, { en, cn, node } );
};


const errorMessage = ( error, en, cn ) => {

	switch ( error ) {

		case 1:
			return `Missing Translation: Incorrect cn parameter: en --> ${en}`;

		case 2:
			return `Missing Translation: Identical en and cn parameters: en --> ${en}`;

		case 3:
			return `Missing Translation: cn parameter is filler content: en --> ${en}`;
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