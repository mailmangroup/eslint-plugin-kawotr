# Enforce having a proper value fro `kawo.tr`

This rule ensures that the `cn` value passed to `kawo.tr` is not `null`, `false`, `undefined`, `''` or the same as the `en` parameter
so we don't miss translations in production.

# Fail

```javascript
kawo.tr( 'Test' )
```

```javascript
kawo.tr( 'Test', '' )
```

```javascript
kawo.tr( 'Test', 'Test' )
```

```javascript
kawo.tr( 'Test', '中文中文中文' )
```

```javascript
kawo.tr( 'Test', false, true )
```

```javascript
kawo.tr( 'Test', null, true )
```

# Pass

```javascript
kawo.tr( 'Test', '测试' )
```

```javascript
kawo.tr( 'Test', '测试', true )
```

Single, commonly used English strings can pass if a lookup function is provided that returns a valid value based on the `en` key.

```javascript
kawo.tr( 'Weibo' )
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