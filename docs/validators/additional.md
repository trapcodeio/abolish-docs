# Additional Validators

Abolish also provides additional validators that can be registered and used to validate, but not added to the global scope.

## Menu

-   String
    -   [alphaNumeric](#alphanumeric)
    -   [boolean](#boolean)
    -   [date](#date)
    -   [email](#email)
    -   [ipAddress](#ipaddress)
    -   [json](#json)
    -   [jsonDecode](#jsondecode)
    -   [jsonEncode](#jsonencode)
    -   [md5](#md5)
    -   [number](#number)
    -   [regex](#regex)
    -   [string](#string)
    -   [url](#url)
-   Array
    -   [any](#any)
-   Utils
    -   [same](#same)

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
Abolish.test("hello", { regex: /^hello$/ }); // => true
Abolish.test("hello", { regex: /^hello$/i }); // => false
```

### string

Check if the value is a string.

```javascript
Abolish.test(1, "string"); // => false
Abolish.test("hello", "string"); // => true
```

The `string` validator also supports the `trim, toLowerCase` and any other method that is available on javascript `String` that does not require arguments. For example:

```javascript
const str = Abolish.attempt("  Hello  ", "string:trim|string:toLowerCase");
// is equivalent to
" Hello ".trim().toLowerCase();
// Result: str === "hello"

// Can also be written as
const str = Abolish.attempt("  Hello  ", "string:trim,toLowerCase"); // chain method

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

Check if the value is an array.

```javascript
const role = "user";
Abolish.test(role, { any: ["staff", "admin"] }); // => false
Abolish.test(role, { any: ["user", "subscriber"] }); // => true
```

Note: Maybe renamed/aliased to `inArray` in the future.

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
