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

// prettier-ignore
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
```

### $errors

Unlike [`$error`](#error), the `$errors` key gives you the ability to define/override errors for each validator.

Note: The `$error` key overrides the `$errors` key.

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
