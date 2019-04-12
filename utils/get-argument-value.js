module.exports = ( context, nodeArgument ) => {

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