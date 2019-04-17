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
			message = `Missing Translation: Call to kawo.tr with an incorrect cn parameter: en --> ${en}`;
			break;

		case 2:
			message = `Missing Translation: Call to kawo.tr with identical en and cn parameters: en --> ${en}`;
			break;

		case 3:
			message = `Missing Translation: Call to kawo.tr with filler content: en --> ${en}`;
			break;
	}

	return {
		ruleId: 'no-invalid-params',
		message
	};
}

ruleTester.run( 'no-invalid-params', rule, {

	valid: [
		`kawo.tr( 
			[ 'This post will be published ', h( 'strong', 'immediately' ) ]
		 )`,
		`kawo.tr( key )`,
		`kawo.tr( key.toLowerCase() )`,
		`kawo.tr( error.displayError || image.getAttribute( 'failedMsg' ) )`,
		`kawo.tr( test ? 'Something' : 'Something Else', '' )`,
		`kawo.tr( \`Top Posts Ranked by \${impressions}\`, \`根据\${impressions}排名的帖子\` )`,
		`kawo.tr( 'Top Posts Ranked by ' + 'impressions', '根据' + '排名的帖子' )`,
		`kawo.tr( 'Top Posts Ranked by ' + label.en, '根据' + label.cn + '排名的帖子' )`,
		`kawo.tr( label.total.en, label.total.cn )`,
		`kawo.tr( 'Test', '测试' )`,
		`kawo.tr( 'Test', '测试', true )`,
		`kawo.tr( 'Test', '中文测试中文', true )`,
		`kawo.tr( 'Weibo' )`,
		`kawo.tr( '100,000', '100,000' )`
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
			code: `kawo.tr( \`Top Posts Ranked by \${impressions}\`, '' )`,
			errors: [ buildError( 1, "`Top Posts Ranked by ${impressions}`", '' ) ]
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