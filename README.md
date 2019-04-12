# eslint-plugin-kawotr

Check for valid uses of the kawo.tr translation function

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-kawotr`:

```
$ npm install https://github.com/fergusjordan/eslint-plugin-kawotr --save-dev
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



