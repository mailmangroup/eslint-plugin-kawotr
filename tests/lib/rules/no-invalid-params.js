'use strict';

const rule = require( '../../../lib/rules/no-invalid-params' ),
	  RuleTester = require( 'eslint' ).RuleTester;

RuleTester.setDefaultConfig({
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module'
	}
});

const ruleTester = new RuleTester({
	settings: {
		translationsLookup: function( lookup, returnLang ) {

			var localeObject,
				translations,
				translationsLowerCase = {};

			translations = {
				'weibo': {
					cn: '微博'
				}
			};

			for ( const key in translations )
				translationsLowerCase[ key.toLowerCase() ] = translations[ key ];

			// FIND IN STRINGS OBJECT
			localeObject = translationsLowerCase[ lookup.toLowerCase() ];

			// GET STRING › DEFAULT TO CHINESE RETURN LANGUAGE
			return ( localeObject && localeObject[ returnLang || 'cn' ] ) || false;
		}
	}
});

function buildError( error, en, cn ) {

	let message = '';

	switch ( error ) {

		case 1:
			message = `Missing Translation: Call to kawo.tr with an incorrect cn parameter: kawo.tr( ${en}, ${cn} )`;
			break;

		case 2:
			message = `Missing Translation: Call to kawo.tr with identical en and cn parameters: kawo.tr( ${en}, ${cn} )`;
			break;

		case 3:
			message = `Missing Translation: Call to kawo.tr with filler content: kawo.tr( ${en}, ${cn} )`;
			break;
	}

	return {
		ruleId: 'no-invalid-params',
		message
	};
}

ruleTester.run( 'no-invalid-params', rule, {

	valid: [
		`kawo.tr( 'Top Posts Ranked by ' + label.en, '根据' + label.cn + '排名的帖子' )`,
		`kawo.tr( label.total.en, label.total.cn )`,
		`kawo.tr( 'Test', '测试' )`,
		`kawo.tr( 'Test', '测试', true )`,
		`kawo.tr( 'Test', '中文测试中文', true )`,
		`kawo.tr( 'Weibo' )`
	],

	invalid: [
		{
			code: `kawo.tr( 'Test' )`,
			errors: [ buildError( 1, 'Test' ) ]
		},
		{
			code: `kawo.tr( 'Test', '' )`,
			errors: [ buildError( 1, 'Test', '' ) ]
		},
		{
			code: `kawo.tr( 'Test', false )`,
			errors: [ buildError( 1, 'Test', false ) ]
		},
		{
			code: `kawo.tr( 'Test', null )`,
			errors: [ buildError( 1, 'Test', null ) ]
		},
		{
			code: `kawo.tr( 'Test', 'Test' )`,
			errors: [ buildError( 2, 'Test', 'Test' ) ]
		},
		{
			code: `kawo.tr( 'Test', '中文中文中文' )`,
			errors: [ buildError( 3, 'Test', '中文中文中文' ) ]
		}
	]
});