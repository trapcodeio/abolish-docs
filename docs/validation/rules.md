---
prev: ./methods.md
next: /validators/create.md
---

# Validation Rules

A Validation rule is a syntax that carries information about the validators that should be used to validate any input and the order at which rules should be applied.

Validation rules can be written in a number of ways:

```javascript
// object
{ required: true, minLength: 2 };

// string (short-hand)
"required|minLength:2";

// array of both
[ "required", { minLength: 2 } ];
```

Note: All validation rules are **converted/parsed** to `objects` before being applied.
All rules type used in the example above will be converted to:

```javascript
{ required: true, minLength: 2 }
```

This means that validation rules already defined as `objects` will be slightly faster than the others.

## Types

### Object

The object syntax is the default way of defining validation rules. where the object `keys` are the **validators** and the `values` are the **validation options**.

```javascript
{required: true, minLength: 2}
// `required` is a validator, `true` is the validation option.
// `minLength` is a validator, `2` is the validation option.
```

### String (short-hand)

The string syntax is a shorthand for writing validation rules where:

-   Rules are separated by `|`
-   `:` (if present) is used to separate the `validator` and its validation `option`.
-   It sets validation option to `true` by default and `false` if the `!` sign is used.
-   Number options are converted to numeric values.

For example:

```javascript
"required"; // => { required: true }

"!required"; // => { required: false }

"minLength:2|maxLength:10"; // => { minLength: 2, maxLength: 10 }

"exact:hello"; // => { exact: "hello" }
```

### Array

The array syntax is a shorthand used for mixing `string` and `object` validation rules.

For example:

```javascript
["required", { minLength: 2 }];
// => { required: true, minLength: 2 }

// Or when using super rules that begins with `$`
[
    "required|minLength:2",
    {
      $name: "Custom Name",
      $error: "A custom error message"
    }
];

// wii be converted to:
{
    required: true,
    minLength: 2,
    $name: "Custom Name",
    $error: "A custom error message"
};
```

## Super Rules

Super rules are rules that starts with `$`.

### $name

if the `$name` key is present, it will be used as the `name` of the field.

```javascript
Abolish.attempt(18, ["typeof:number|max:5"]);
// Error: Variable is too big. (Max. 5)

Abolish.attempt(18, ["typeof:number|max:5", { $name: "Age" }]);
// Error: Age is too big. (Max. 5)
```

### $error

if the `$error` key is present, it will be used as the `error` message.

```javascript
// prettier-ignore
Abolish.attempt(18, [
    "typeof:number|max:5", 
    { $error: "You are just too old for this." }
]);
// Error: You are just too old for this.
```

### $errors

Unlike [`$error`](#error), the `$errors` key gives you the ability to define/override errors for each validator.

Note: The `$errors` key overrides the `$error` key.

```javascript
Abolish.attempt("not a number", ["typeof:number|max:5"]);
// Error: Variable is not typeof number

// Define custom error message for `typeof`
Abolish.attempt("not a number", [
    "typeof:number|max:5",
    { $errors: { typeof: "Please enter a number" } }
]);
// Error: Please enter a number.
```

### $skip

The `$skip` rule is used to skip validation for a specific field or variable. it accepts a `boolean` or a `function(value?) => boolean`.
if true, the field will be skipped.

```javascript
let skipMobile = true;

Abolish.validate(data, {
    mobile: {
        $skip: skipMobile,
        someMobileValidator: true
    },
    username: "required"
});

// mobile will not be validated because `$skip` is true
// `$skip` can also accept a function that returns a boolean
// The current value its validating will be passed to that function also

skipMobile = (mobile) => {
    // skip if mobile is empty else run validation.
    return !mobile.length;
};

// mobile will be validated because :skip function returned false
```

`$skip` also works when using `attempt`, `check` or `test` validation methods.

```javascript
// Attempt
const comment = Abolish.attempt(rawComment, [
    // skip validation if admin
    { $skip: authUser === "admin" },
    "checkForSpam"
]);
// Validation will be skipped if `authUser` is `admin`
// post will be the same as someBlogPost if not modified by any validator.
```

### $inline

The `$inline` rule provides a way to validate without pre-defining a validator.

```javascript
// Syntax
Abolish.attempt(value, { $inline: (value, { modifier, error }) => boolean | error });

// Example
Abolish.attempt("mail.example.com", {
    $inline: (value, { modifier, error }) => {
        // validate email address
        if (!value.includes("@")) {
            throw new Error("Invalid email address");
            // OR
            return error("Invalid email address");
        }

        // set to lowercase
        modifier.setThis(value.toLowerCase());
    }
});
// Error: Invalid email address
```

## Helpers

These are syntactic sugar functions to make declaring rules easier.

### Rule()

The `Rule` function is used **parse/combine** rules to an `object

```javascript
const {Rule} = require("abolish"); // OR import {Rule} from "abolish";

const isEmail = Rule("typeof:string|email");
// will be converted to:
{ typeof: "string", email: true }

// Or with custom name and error message
const isEmail = Rule([
    "typeof:string|email",
    { $name: "Email address", $error: "Please enter a valid email address"}
]);

// will be converted to:
{
    typeof: "string",
    email: true,
    $name: "Email address",
    $error: "Please enter a valid email address"
};
```

### Schema()

The `Schema` function is used to parse `key:rule` pairs.

```javascript
const {Schema} = require("abolish"); // OR import {Schema} from "abolish";

const rules = Schema({
    name: "required|string",
    age: "required|typeof:number|min:18|max:100"
});

// will be converted to:
{
  name: { required: true, string: true },
  age: { required: true, typeof: 'number', min: 18, max: 100 }
}
```

### $inline()

The `$inline` is a helper function to create an `$inline` validator rule.

```javascript
const { $inline } = require("abolish/src/helpers");
// OR import {$inline} from "abolish/src/helpers";

$inline((value, { modifier, error }) => true);
// is the same as: (But Typed)
{
    $inline: (value, { modifier, error }) => true;
}
```

As seen in the example above, the `$inline` function accepts a validator function as its first argument.

It can also accept an error message as its second argument. Note that this error message is used as `$error` property.

Using the same example used in the [$inline](#inline) validator:

```javascript
// It will be
Abolish.attempt(
    "mail.example.com",
    $inline((value, { modifier, error }) => {
        // validate email address
        if (!value.includes("@")) {
            throw new Error("Invalid email address");
            // OR
            return error("Invalid email address");
        }

        // set to lowercase
        modifier.setThis(value.toLowerCase());
    })
);
```

### skipIfUndefined()

The `skipIfUndefined` is a helper function to create a `$skip` if `value===undefined` validator rule.

```javascript
const { skipIfUndefined } = require("abolish/src/helpers");
// OR import {skipIfUndefined} from "abolish/src/helpers";

skipIfUndefined("number|min:18");
// will be converted to:
{
    $skip: (value) => value === undefined,
    number: true,
    min: 18
}
```

### skipIfNotDefined()

The `skipIfNotDefined` is a helper function to create a `$skip` if `value===undefined | null` validator rule.

```javascript
const { skipIfNotDefined } = require("abolish/src/helpers");
// OR import {skipIfNotDefined} from "abolish/src/helpers";

skipIfNotDefined("number|min:18");
// will be converted to:
{
    $skip: (value) => value === undefined || value === null,
    number: true,
    min: 18
}
```
