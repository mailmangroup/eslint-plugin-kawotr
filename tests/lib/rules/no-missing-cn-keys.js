'use strict';

const rule = require( '../../../lib/rules/no-missing-cn-keys' ),
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
			message = `Missing Translation: Incorrect cn parameter: { en: ${en}, cn: ${cn} } `;
			break;

		case 2:
			message = `Missing Translation: Identical en and cn parameters: { en: ${en}, cn: ${cn} } `;
			break;

		case 3:
			message = `Missing Translation: cn parameter is filler content: { en: ${en}, cn: ${cn} } `;
			break;
	}

	return {
		ruleId: 'no-missing-cn-keys',
		message
	};
}


ruleTester.run( 'no-missing-cn-keys', rule, {

	valid: [
		"let obj = { en: key }",
		"let obj = { en: key.toLowerCase() }",
		"let obj = { en: error.displayError || image.getAttribute( 'failedMsg' ) }",
		"let obj = { en: test ? 'Something' : 'Something Else', cn: '' }",
		"let obj = { en: `Top Posts Ranked by ${impressions}`, cn: `根据${impressions}排名的帖子` }",
		"let obj = { en: 'Top Posts Ranked by ' + 'impressions', cn: '根据' + '排名的帖子' }",
		"let obj = { en: 'Top Posts Ranked by ' + label.en, cn: '根据' + label.cn + '排名的帖子' }",
		"let obj = { en: label.total.en, cn: label.total.cn }",
		"let obj = { en: 'Test', cn: '测试' }",
		"let obj = { en: 'Test', cn: '中文测试中文' }",
		"let obj = { en: 'Weibo' }"
	],

	invalid: [
		{
			code: "let obj = { en: 'Test' }",
			errors: [ buildError( 1, 'Test' ) ]
		},
		{
			code: "let obj = { en: 'Test', cn: '' }",
			errors: [ buildError( 1, 'Test', '' ) ]
		},
		{
			code: "let obj = { en: \`Top Posts Ranked by \${impressions}\`, cn: '' }",
			errors: [ buildError( 1, "`Top Posts Ranked by ${impressions}`", '' ) ]
		},
		{
			code: "let obj = { en: 'Test', cn: false }",
			errors: [ buildError( 1, 'Test', false ) ]
		},
		{
			code: "let obj = { en: 'Test', cn: null }",
			errors: [ buildError( 1, 'Test', null ) ]
		},
		{
			code: "let obj = { en: 'Test', cn: 'Test' }",
			errors: [ buildError( 2, 'Test', 'Test' ) ]
		},
		{
			code: "let obj = { en: 'Test', cn: '中文中文中文' }",
			errors: [ buildError( 3, 'Test', '中文中文中文' ) ]
		}
	]
});