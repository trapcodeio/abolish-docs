---
prev:
    text: Installation
    link: /index.html
next: ./rules.md
---

# Validation Methods

Abolish provides **4** validation Methods: `validate, attempt, check, test`. All with async support.

| Method                        | Description                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------- |
| **`validate, validateAsync`** | Validate **objects**. **Go Lang** error handling style. No Error thrown.     |
| **`attempt, attemptAsync`**   | Validate variable, Throw error when validation fails.                        |
| **`check, checkAsync`**       | Validate variable but use **Go Lang** error handling style. No Error thrown. |
| **`test, testAsync`**         | Validate variable, return boolean. `true` for pass and `false` for fail.     |

<br>

## validate

The validate method is for validating **objects**. unlike other methods,
<br>it takes an Object of `{key: rules}` structure as rules.

<CodeGroup>
  <CodeGroupItem title="Code">

```javascript
const data = {
    email: "mail@example.com",
    password: undefined,
    referrer: "john"
};

const [err, validated] = Abolish.validate(data, {
    email: "required|typeof:string",
    password: "required|typeof:string"
});

console.log([err, validated]);
```

  </CodeGroupItem>

  <CodeGroupItem title="Fail">

```javascript
// WILL LOG
[
    // The error object
    {
        key: "password",
        type: "validator",
        validator: "required",
        message: "Password is required.",
        data: null
    },
    {} // validated will be empty when error.
];
```

  </CodeGroupItem>

<CodeGroupItem title="Pass">

```javascript
// Assuming password is `password2020` not `undefined`
// WILL LOG
[
    // error is false
    false,
    // only validated keys
    { email: "mail@example.com", password: "password2020" }
];
```

  </CodeGroupItem>
</CodeGroup>

### Include Fields - $include

From the example [above](#validate), you will notice that only keys defined in rules are returned in validated.
i.e. `referrer` which is present in the `data` object, is not included in the returned validated object.

To include fields in the validated object, `$include` is a super key that lets you define keys you want to be included
in the validated object like so:

```javascript
const data = {
    email: "mail@example.com",
    password: "password",
    referrer: "john"
};

const [err, validated] = Abolish.validate(data, {
    email: "required|typeof:string",
    password: "required|typeof:string",
    $include: ["referrer"]
});

console.log([err, validated]);

// WILL LOG
[
    // error is false
    false,
    // `referrer` is included.
    {
        email: "mail@example.com",
        password: "password",
        referrer: "john"
    }
];
```

### Strict Mode - $strict
The $strict key is used to enforce that only keys defined in the rules object are allowed in the data object.
Should any key not defined in the rules object be found in the data object, an error will be thrown.

To enable strict mode, set `$strict` to `true` like so:
```js
let data = {email: "mail@example.com", password: "12345"}

let [err, body] = Abolish.validate(data, {
    $strict: true,  // Enable strict mode
    email: "required|typeof:string"
});
```

An error will be thrown because `password` is not defined in the rules object.

```json
{
  "code": "object.unknown",
  "type": "internal",
  "key": "$strict",
  "validator": "$strict",
  "message": "Data contains unknown fields!",
  "data": {
    "unknown": [
      "password"
    ]
  }
}
```

To allow specific keys to ignored by the strict mode:

- we can either pass them as an array option to `$strict`
- or add them to the `$include` array.

```js
// via array option
let [ err, body ] = Abolish.validate(data, {
    $strict: ["password"],
    email: "required|typeof:string"
});

// or via $include
let [ err, body ] = Abolish.validate(data, {
    $strict: true,
    $include: ["password"],
    email: "required|typeof:string"
});
```
### Wildcard

The Wildcard rules `*` or `$` can be used to define rules that will apply to all keys defined in a rules object.

```javascript
Abolish.validate(object, {
    "*": "required|typeof:string",
    email: true,
    password: true
});

// will be converted to
Abolish.validate(object, {
    email: "required|typeof:string",
    password: "required|typeof:string"
});

// With extra validators
Abolish.validate(object, {
    "*": "required|typeof:string",
    email: "email",
    password: "minLength:6"
});

// will be converted to
Abolish.validate(object, {
    email: "required|typeof:string|email",
    password: "required|typeof:string|minLength:6"
});
```

### validateAsync

The async method for [#validate](#validate)

## attempt

The attempt method is for validating **variables**. it throws an error when validation fails and returns the validated value on success.

it takes the syntax of `validate(variable, rules);`

```javascript
const bool = Abolish.attempt(0, "boolean"); // pass
// bool === false
const number = Abolish.attempt("1234", "number"); // pass
// number === 1234

const age = Abolish.attempt(12, "min:18"); // fail
// Throw Error: Variable is too small. (Min. 18)
```

### attemptAsync

The async method for [#attempt](#attempt)

## check

Check is for validating **variables** but unlike attempt does not throw an error. It returns a **Go Lang** error typeof syntax like [validate](#validate)

<CodeGroup>
  <CodeGroupItem title="Fail">
  
```javascript
const [error, age] = Abolish.check(12, "min:18");

// error === {
// key: 'variable',
// type: 'validator',
// validator: 'min',
// message: 'Variable is too small. (Min. 18)',
// data: null
// },

// age === undefined

````

   </CodeGroupItem>

   <CodeGroupItem title="Pass">

```javascript
const [error, age] = Abolish.check(28, "min:18");
// error === false
// age === 28
````

   </CodeGroupItem>

</CodeGroup>

### checkAsync

The async method for [#check](#check)

## test

The test method does not throw an exception or return an error. It returns a boolean value. If the validation fails, it returns false else true.

```javascript
Abolish.test(12, "min:18"); // false
Abolish.test("My Name", "minLength:3|maxLength:20"); // true
Abolish.test([], "typeof:array"); // true
```

### testAsync

The async method for [#test](#test)
