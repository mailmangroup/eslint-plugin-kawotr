# eslint-plugin-kawotr

Check for valid uses of the kawo.tr translation function or missing `cn` keys on any object with an `en` key.

It's designed to be very lenient, letting through anything that it can't properly challenge. As long as you've
provided a `translationsLookup` function on settings, it will let through any parameter that isn't a string (i.e. variables it can't evaluate).

By default, it will error if the `cn` and `en` keys match since that's likely not a valid translation.
However, you can provide an array of values (`allowedMatchingValues`) on settings that will be allowed 
through in the event the parameters match `allowedMatchingValues: [ ... 'px', '+', '#' ... ]`

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-kawotr`:

```
$ npm install https://github.com/mailmangroup/eslint-plugin-kawotr --save-dev
```

## Usage

Add `kawotr` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "kawotr"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "kawotr/no-invalid-params": 2,
        "kawotr/no-missing-cn-keys": 2
    }
}
```



