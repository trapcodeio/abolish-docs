# Validation Methods

Abolish provides 3 validation Methods: `attempt, check & validate`

| Method                        | Description                                                                  |
|-------------------------------|------------------------------------------------------------------------------|
| **`validate, validateAsync`** | Validate **objects**.  **Go Lang** error handling style. No Error thrown.    |
| **`attempt, attemptAsync`**   | Validate variable, Throw error when validation fails.                        |
| **`test, testAsync`**         | Validate variable, return boolean. `true` for pass and `false` for fail.     |
| **`check, checkAsync`**       | Validate variable but use **Go Lang** error handling style. No Error thrown. |

<br>

## validate

The validate method is for validating objects. unlike other methods, 
<br>it takes an Object  of `{key: rules}` structure as rules.


<CodeGroup>
  <CodeGroupItem title="Code">

```javascript
const data = {
  email: 'mail@example.com',
  password: undefined,
  referrer: 'john'
};

const [err, validated] = Abolish.validate(data, {
  email: 'required|typeof:string',
  password: 'required|typeof:string',
})

console.log([err, validated]);
```

  </CodeGroupItem>

  <CodeGroupItem title="Fail">

```javascript
// WILL LOG
[
  // The error object
  {
    key: 'password',
    type: 'validator',
    validator: 'required',
    message: 'Password is required.',
    data: null
  },
  {} // validated will be empty when error.
]
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
  {email: 'mail@example.com', password: 'password2020'}
]
```

  </CodeGroupItem>
</CodeGroup>

### $include

From the example [above](#validate), you will notice that only keys defined in rules are returned in validated.
i.e. `referrer` which is present in the `data` object, is not included in the returned validated object.

To include fields in the validated object, `$include` is a super key that lets you define keys you want to be included
in the validated object like so:

```javascript
const data = {
  email: 'mail@example.com',
  password: 'password',
  referrer: 'john'
};

const [err, validated] = Abolish.validate(data, {
  email: 'required|typeof:string',
  password: 'required|typeof:string',
  $include: ['referrer']
})

console.log([err, validated]);

// WILL LOG
[
  // error is false
  false,
  // `referrer` is included.
  {
    email: 'mail@example.com',
    password: 'password',
    referrer: 'john'
  }
]
```

### Wildcard

The Wildcard rule can be used to define rules that will apply to all keys defined in a rules object.

```javascript
Abolish.validate(object, {
  "*": "required|typeof:string",
  email: true,
  password: true,
});

// will be converted to
Abolish.validate(object, {
  email: "required|typeof:string",
  password: "required|typeof:string",
});

// With extra validators
Abolish.validate(object, {
  "*": "required|typeof:string",
  email: "email",
  password: "minLength:6",
});

// will be converted to
Abolish.validate(object, {
  email: "required|typeof:string|email",
  password: "required|typeof:string|minLength:6",
});
```

## validateAsync

The async method for [#validate](#validate)