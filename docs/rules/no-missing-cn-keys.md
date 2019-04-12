# Enforce that any object with an en property has a cn property

This rule ensures that any object with an `en` property also has a `cn` property.

# Fail

```javascript
let text = {
	en: 'Test',
	cn: ''
};
```

```javascript
let text = {
	en: 'Test'
};
```

```javascript
let text = {
	en: 'Test',
	cn: 'Test'
};
```

```javascript
let text = {
	en: 'Test',
	cn: '中文中文中文'
};
```

```javascript
let text = {
	en: 'Test',
	cn: false
};
```

```javascript
let text = {
	en: 'Test',
	cn: null
};
```

# Pass

```javascript
let text = {
	en: 'Test',
	cn: '测试'
};
```

Single, commonly used English strings can pass if a lookup function is provided that returns a valid value based on the `en` key.

```javascript
let text = {
	en: 'Weibo'
};
```

KAWO's lookup function for common string translations is something like this and passed through to the test's settings:

```javascript
export default function( lookup, returnLang ) {

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
```

# Generously pass 

We give ourselves the benefit of the doubt in a few instances since we can't know certain variable values,
can't process VirtualDom nodes, etc.

We let through: 
- Variables (Identifier)
- Arrays (ArrayExpression) -- usually to pass in VirtualDom nodes like `h( 'strong' )`
- Conditionals (ConditionalExpression)
- Functions (CallExpression)
- Objects (MemberExpression)
- Ternary operators (LogicalExpression)
- Binary expressions (BinaryExpression) -- concatenated strings count as a binary expression
  - Note that we will try and treat as a string by running `eval( string )` in an attempt to perform the concatenation to run against our lookup function.

```javascript
let text = {
	en: [ 'This post will be published ', h( 'strong', 'immediately' ) ]
};
```

```javascript
let text = {
	en: key
};
```

```javascript
let text = {
	en: error.displayError || image.getAttribute( 'failedMsg' )
};
```

```javascript
let text = {
	en: test ? 'Something' : 'Something Else', ''
};
```

```javascript
let text = {
	en: `Top Posts Ranked by ${impressions}`,
	cn: `根据${impressions}排名的帖子`
};
```

```javascript
let text = {
	en: 'Top Posts Ranked by ' + 'impressions',
	cn: '根据' + '排名的帖子'
};
```

```javascript
let text = {
	en: 'Top Posts Ranked by ' + label.en,
	cn: '根据' + label.cn + '排名的帖子'
};
```

```javascript
let text = {
	en: label.total.en,
	cn: label.total.cn
};
```