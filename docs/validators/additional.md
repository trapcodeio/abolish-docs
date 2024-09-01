# Additional Validators

Abolish also provides additional validators that can be registered and used to validate, but not added to the global
scope.

## Validators

- String
    - [alphaNumeric](#alphanumeric)
    - [boolean](#boolean)
    - [date](#date)
    - [email](#email)
    - [ipAddress](#ipaddress)
    - [json](#json)
    - [jsonDecode](#jsondecode)
    - [jsonEncode](#jsonencode)
    - [md5](#md5)
    - [number](#number)
    - [regex](#regex)
    - [string](#string)
    - [url](#url)
- Array
    - [any](#any)
    - [array](#array)
    - [arraySize](#arraysize)
    - [arrayValues](#arrayvalues)
    - [arrayValuesAsync](#arrayvaluesasync)
    - [inArray](#inarray)
    - [notInArray](#notinarray)
- Object
    - [objectValues](#objectvalues)
    - [objectValuesAsync](#objectvaluesasync)
    - [objectValuesType](#objectvaluestype)
- Utils
    - [same](#same)
- Number
    - [gt](#gt)
    - [lt](#lt)

## File Structure

Validator files exists in the `abolish/validators` folder like so:

```
📂 string
  📄 alphaNumeric.js
  📄 boolean.js
  📄 ... e.t.c
  📄 index.js - to require all validators in this folder

📂 array
  📄 any.js
  📄 index.js - to require all validators in this folder

📂 e.t.c (As listed above)
  📄 validator.js
  📄 index.js - to require all validators in this folder
```

With the structure above we can import `email, apiAddress` and all `utils` like so

```js
const {Abolish} = require("abolish");

// Add Email
Abolish.addGlobalValidator(require("abolish/validators/string/email"));
// Add Ipaddress
Abolish.addGlobalValidator(require("abolish/validators/string/ipAddress"));

// Add all in one category
Abolish.addGlobalValidators(require("abolish/validators/utils"));
// This will reqiure the `index.js` file.
```

### registerAllValidators()

If you would like to register/load all validators available, this function is a shorthand for that.
It takes abolish class as an argument.

```javascript
const {Abolish} = require("abolish");
const {registerAllValidators} = require("abolish/src/ValidatorHelpers");

registerAllValidators(Abolish);
```

This will come handy in server side applications.

### registerValidators()

This function is used to register specific validator categories.
It takes abolish class as an argument, followed by an array of validator categories.

```javascript
const {Abolish} = require("abolish");
const {registerValidators} = require("abolish/src/ValidatorHelpers");

// Register all string validators
registerValidators(Abolish, "string");
```

## String Validators

### alphaNumeric

Check if the string is alphanumeric.

```javascript
Abolish.test("Hello 2022!", "alphaNumeric");
// => false

Abolish.test("hello2022", "alphaNumeric");
// => true
```

### boolean

Check if the value is boolean

```javascript
Abolish.test(true, "boolean"); // => true
Abolish.test(false, "boolean"); // => true

// 1 will be converted to true
Abolish.test(1, "boolean"); // => true
// (0 will be converted to false
Abolish.test(0, "boolean"); // => true

// `true` will be converted to true
Abolish.test("true", "boolean"); // => true
// `false` will be converted to false
Abolish.test("false", "boolean"); // => true
```

### date

Check if the value is a valid date. Also cast to date if `cast` is true.

```javascript
const date = Abolish.attempt("2020-01-01", "date");
// Validation passed
// date === "2020-01-01"

// Cast to date
const date = Abolish.attempt("2020-01-01", "date:cast");
// Validation passed
// date instanceof Date
// date === new Date("2020-01-01")
```

### email

Check if the value is a valid email and also converts to lowercase.

```javascript
Abolish.test("hello", "email"); // => false
Abolish.test("john@email.com", "email"); // => true
```

### ipAddress

Checks if the value is a valid IP address. supports IPv4 and IPv6.

```javascript
// validate ipv4
Abolish.test("69.89.31.226", "ipAddress"); // => true
// validate ipv6
Abolish.test("2002:4559:1FE2::4559:1FE2", "ipAddress"); // => true
```

### json

Check if the value is a valid JSON string.

```javascript
Abolish.test("{}", "json"); // => true
Abolish.test("[1,2,3]", "json"); // => true
Abolish.test("[1,2,3,,,,]", "json"); // => false
```

### jsonDecode

Decode the value as JSON.

```javascript
const decoded = Abolish.attempt("[1,2,3]", "json|jsonDecode");
// we put `json` in front of `jsonDecode` to check if the value is valid JSON first.
// decoded === [1,2,3]
```

Note: In `object` using `validate/validateAsync`, Decoded values can also be validated after decoding. for example:

```javascript
const json = JSON.stringify({
    city: "New York",
    country: "USA"
});

Abolish.attempt(json, [
    "json|jsonDecode",
    // This will validate the decoded value
    // because it was called after `json|jsonDecode`
    {
        object: {
            city: "required|string",
            country: "required|string"
        }
    }
]);
```

### jsonEncode

Encode the value as JSON.

```javascript
const json = Abolish.attempt(
    {
        city: "New York",
        country: "USA"
    },
    "jsonEncode"
);

// json === '{"city":"New York","country":"USA"}'
```

### md5

Checks if the value is a valid md5 hash.

```javascript
Abolish.test("hello", "md5"); // => false
Abolish.test("d4f3a1c8c9f9e1816dd6c3d3d5aaf0bf", "md5"); // => true
```

### number

check if the value is a valid number using `isNaN`. Also casts non number values to number.

```javascript
Abolish.test("hello", "number"); // => false
Abolish.test(1, "number"); // => true
Abolish.test("1", "number"); // => true
Abolish.test("1a", "number"); // => false
```

### regex

Pass a regular expression to check if the value matches the regular expression.

```javascript
Abolish.test("Hello", {regex: /^hello$/}); // => false
Abolish.test("hello", {regex: /^hello$/i}); // => true
```

### string

Check if the value is a string.

```javascript
Abolish.test(1, "string"); // => false
Abolish.test("hello", "string"); // => true
```

The `string` validator also supports the `trim, toLowerCase` and any other method that is available on
javascript `String` that does not require arguments. For example:

```javascript
const str = Abolish.attempt("  Hello  ", "string:trim");
// is equivalent to
" Hello ".trim().toLowerCase();
// Result: str === "Hello"

// Using Chain method
const str = Abolish.attempt("  Hello  ", "string:trim,toLowerCase");
// Result: str === "hello"

// Any `String` method that does not require arguments can be chained
const str = Abolish.attempt("Cat", "string:trim,toLowerCase,bold,big");
// is equivalent to
"Cat".trim().toLowerCase().bold().big();

// Result: str === "<big><b>Cat</b></big>"
```

### url

Check if the value is a valid URL.

```javascript
Abolish.test("hello", "url"); // => false
Abolish.test("https://google.com", "url"); // => true
```

## Array Validators

### any

::: warning
**Deprecated**: Use `inArray` instead.
:::

### array

- Check if the validated value is an array
- Or If the array values is of the types specified as option.

```javascript
Abolish.test(1, "array"); // => false
Abolish.test([1, 2, 3], "array"); // => true

// Check if the value is an array of numbers
Abolish.test([1, 2, 3], "array:number"); // => true

// Or check if array values are either of type string or number
Abolish.test(["hello", 1, 2], {array: ["string", "number"]}); // => true

// The test below will fail because 
// `object` is not included in the types array.
Abolish.test(["hello", 1, 2, {}], {array: ["string", "number"]})
) // => false
```

### arraySize

Unlike `size` validator, `arraySize` is explicitly for arrays.

```javascript
Abolish.test([1, 2, 3], "arraySize:3"); // => true
Abolish.test([1, 2, 3, 4], "arraySize:3"); // => false

// Check either using multiple sizes
Abolish.test(["a", "b", "c"], {arraySize: [2, 3]}); // => true
Abolish.test(["a", "b", "c", "d"], {arraySize: [2, 3]}); // => false
```

### arrayValues

Validate array values using **abolish rules**
The validator will stop once it finds a value that fails validation.

```javascript
// validating an array of iso3 country codes
Abolish.test(["USA", "CAN"], {
    arrayValues: "typeof:string|size:3"
}); // => true

// Or a more complex array of objects
const data = [
    {id: 1, name: "John"},
    {id: 2, name: "Jane"},
    {id: 3, name: "Jack"}
];

const value = Abolish.attempt(data, {
    arrayValues: {
        object: {
            id: "typeof:number",
            name: "typeof:string"
        }
    }
});
```

### arrayValuesAsync

Same as [arrayValues](#arrayvalues) but uses async validator to validate each value.

### inArray

Check if validated value exists in an array.

**Note:** this method uses `===` to check if the value exists in the given array and can not handle arrays where values
are typeof `objects`.
To check if the value exists in an array of objects, see [Using a function as option](#using-a-function-as-option).

```javascript
const role = "user";
Abolish.test(role, {inArray: ["staff", "admin"]}); // => false
Abolish.test(role, {inArray: ["user", "subscriber"]}); // => true
```

#### Using a function as option

`inArray` supports using a function as an option.

If the function returns a `boolean` value, `inArray` will assume you passed a validator function.
Else if it returns an `array`, `inArray` will use the returned array as the array to check against.

**Note:** Any function passed to `inArray` will be called with the value to validate as the first argument.

```javascript
const roles = ["user", "admin", "staff"];
// Using a function to return the array to check against
Abolish.test("user", {inArray: () => ["staff", "admin"]}); // => true

// Using a function to returns boolean
Abolish.test("user", {inArray: (value) => roles.includes(value)}); // => true

// A more complex example
const users = [
    {name: "John", role: "admin"},
    {name: "Jane", role: "staff"},
    {name: "Sam", role: "user"}
];

Abolish.test(users[1], {
    // v is the value to validate i.e `users[1]`
    inArray: (v) => users.some((user) => user.name === v.name && user.role === v.role)
}) // => true
```

### notInArray

Check that a value is not in an array.

```javascript
const roles = ["user", "admin", "staff"];
Abolish.test("user", {notInArray: roles}); // => false
Abolish.test("superuser", {notInArray: roles}); // => true
```

#### Using a function as option

The array can be computed using a function.

```javascript
Abolish.test("user", {notInArray: () => ["staff", "admin"]}); // => true
```

The function can also return a boolean value that will be used to determine if the value is in the array.

```javascript
const roles = ["user", "admin", "staff"];
Abolish.test("member", {
    notInArray: (value) => !roles.includes(value)
}); // => true
```

Or something more complex

```ts
type User = { name: string; role: string };
const users: User[] = [
    // random list of users
    {name: "John", role: "admin"},
    {name: "Jane", role: "staff"},
    {name: "Sam", role: "user"}
];


Abolish.test(
    {name: "John1", role: "admin3"},
    {notInArray: (v: User) => !users.some((user) => user.name === v.name)}
) // => true


Abolish.test(users[1], {
    notInArray: (v: User) => !users.some((user) => user.name === v.name)
}) // => false
```

## Object Validators

### objectValues

Validate object values using **abolish rules**
The validator will stop once it finds a value that fails validation.

```javascript
const paymentMethods = {
    paypal: {currency: "USD", enabled: true},
    stripe: {currency: "USD", enabled: true},
    paystack: {currency: "NGN", enabled: false},
    coinpayments: {currency: "BTC", enabled: true}
}

Abolish.test(paymentMethods, {
    objectValues: {
        object: {
            currency: "typeof:string|size:3",
            enabled: "typeof:boolean"
        }
    }
}) // => true
```

### objectValuesAsync

Same as [objectValues](#objectvalues) but uses async validator to validate each value.

### objectValuesType

Check if the object values are of the specified type.

```javascript
Abolish.test({a: 1, b: 2}, "objectValuesType:number"); // => true

// Also supports multiple types
Abolish.test({a: 1, b: "hello"}, {
    objectValuesType: ["number", "string"]
}); // => true
```

## Utility Validators

### same

Check if value is the same as the value of the given key in an object.

```javascript
const form = {
    password: "hello",
    confirmPassword: "hello!"
};

Abolish.test(form, {
    object: {
        password: "required|string",
        confirmPassword: "required|string|same:password"
    }
}); // false

// Error: Confirm Password must be the same as password.
```

## Number Validators

### gt

Check if a number is greater than the specified value.

```javascript
Abolish.test(10, "gt:5"); // => true
Abolish.test(5, "gt:5"); // => false
```

### lt

Check if a number is less than the specified value.

```javascript
Abolish.test(5, "lt:10"); // => true
Abolish.test(10, "lt:10"); // => false
```

## Date Validators

### age
Check if a date is within a specified age range. This validator supports checking if

- date is `=` to the specified age
- date is `>=` to the specified age
- date is `<=` to the specified age
- date is `>` to the specified age
- date is `<` to the specified age
- date is `-` i.e between two ages

Note: Date can be a string or a `Date` object. The string will be converted to a `Date` object.

```javascript
// Equal To
Abolish.test(EighteenYearsAgo, "age:18"); // => true
Abolish.test(EighteenYearsAgo, "age:=18"); // => true

// Greater Than
Abolish.test(EighteenYearsAgo, "age:>17"); // => true
Abolish.test(TwoYearsAgo, "age:>18"); // => false

// Less Than
Abolish.test(EighteenYearsAgo, "age:<19"); // => true
Abolish.test(TwentyYearsAgo, "age:<19"); // => false

// Between
Abolish.test(EighteenYearsAgo, "age:18-20"); // => true
Abolish.test(TwentyYearsAgo, "age:5-10"); // => false

// Greater Than or Equal To
Abolish.test(EighteenYearsAgo, "age:>=18"); // => true
Abolish.test(TwoYearsAgo, "age:>=18"); // => false

// Less Than or Equal To
Abolish.test(EighteenYearsAgo, "age:<=18"); // => true
Abolish.test(TwentyYearsAgo, "age:<=18"); // => false
```