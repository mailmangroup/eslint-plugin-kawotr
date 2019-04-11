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

ruleTester.run( 'no-invalid-params', rule, {

	valid: [
		`kawo.tr( label.total.en, label.total.cn )`,
		`kawo.tr( 'Test', '测试' )`,
		`kawo.tr( 'Test', '测试', true )`,
		`kawo.tr( 'Test', '中文测试中文', true )`,
		`kawo.tr( 'Weibo' )`
	],

	invalid: [
		{
			code: `kawo.tr( 'Test' )`,
			errors: [{
				message: 'Missing Translation: Call to kawo.tr with `null`, `false`, or `undefined` `cn` value',
				type: 'CallExpression'
			}]
		},
		{
			code: `kawo.tr( 'Test', '' )`,
			errors: [{
				message: 'Missing Translation: Call to kawo.tr without an empty `cn` parameter',
				type: 'CallExpression'
			}]
		},
		{
			code: `kawo.tr( 'Test', 'Test' )`,
			errors: [{
				message: 'Missing Translation: Call to kawo.tr with identical `en` and `cn` parameters',
				type: 'CallExpression'
			}]
		},
		{
			code: `kawo.tr( 'Test', false )`,
			errors: [{
				message: 'Missing Translation: Call to kawo.tr with `null`, `false`, or `undefined` `cn` value',
				type: 'CallExpression'
			}]
		},
		{
			code: `kawo.tr( 'Test', null )`,
			errors: [{
				message: 'Missing Translation: Call to kawo.tr with `null`, `false`, or `undefined` `cn` value',
				type: 'CallExpression'
			}]
		},
		{
			code: `kawo.tr( 'Test', '中文中文中文' )`,
			errors: [{
				message: 'Missing Translation: Call to kawo.tr with filler content',
				type: 'CallExpression'
			}]
		}
	]
});