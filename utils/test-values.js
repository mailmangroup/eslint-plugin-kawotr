module.exports = ( context, options ) => {

	let { en, cn, node } = options,
		error = 0;

	const translationsLookup = context.settings.translationsLookup;
	const allowedTypes = [
		'CallExpression', 'ArrayExpression', 'Identifier', 'ConditionalExpression',
		'MemberExpression', 'BinaryExpression', 'LogicalExpression'
	];

	// IF CN NOT PASSED THROUGH TO CALL › RUN AGAINST COMMON TRANSLATIONS ON SETTINGS
	if ( en && ( cn === undefined || cn === 'MemberExpression' ) && typeof translationsLookup === 'function' )
		cn = translationsLookup( en, 'cn' ) || cn;

	// IF PASSED CALCULATED EXPRESSIONS OR VARIABLES › ASSUME CORRECT VALUE PASSED
	// (ALSO LET THROUGH IF NO CN VALUE GIVEN BUT EN IS BINARY OR MEMBER AND WE HAVE LOOKUP FUNCTION)
	if ( allowedTypes.includes( cn ) || !cn && allowedTypes.includes( en ) && typeof translationsLookup === 'function' )
		return { node, error: 0 };

	if ( cn === '' || cn === null || cn === undefined || cn === false ) error = 1;

	else if ( en === cn ) {

		// CHECK AGAINST WHITELIST OF ALLOWED MATCHING VALUES AND ALLOW NUMBERS
		const allowedMatchingValues = context.settings.allowedMatchingValues || [];

		if ( allowedMatchingValues.includes( en ) || !isNaN( parseInt( en ) ) ) return { node, error: 0 };

		error = 2;
	}

	else if ( cn.match( /^(中文)+$/ ) ) error = 3;

	return { en, cn, node, error };

	return value;
};