# Default Validators

Because Abolish is meant for **Custom validations** only **11 default validators** are available out of the box.

### default

Set the default value for the field if undefined or null.

```javascript
const firstName = Abolish.attempt(undefined, { default: "Joe" });
// name === 'Joe'
const lastName = Abolish.attempt("Sam", { default: "Doe" });
// name === 'Sam'
```

### exact

Checks if value **(string, number or boolean)** is exactly equal to the option given.

```javascript
Abolish.attempt(10, "exact:10");
// Pass

Abolish.attempt("john", "exact:joe");
// Error: Variable failed exact validator
```

### max

Checks if a **number** is not greater than the option given.

```javascript
Abolish.attempt(20, "max:25");
// Pass

Abolish.attempt(30, "max:25");
// Error: Variable is too big. (Max. 25)

// Also accepts a valid string number.
Abolish.attempt("20", "min:25");
// Pass
```

### maxLength

Similar to [max](#max), but for **strings**

```javascript
Abolish.attempt("password", "maxLength:250");
// Pass

Abolish.attempt("This is a sentence", "maxLength:10");
// Error: Variable is too long. (Max. 10 characters)
```

### min

Checks if a **number** is not less than the option given.

```javascript
Abolish.attempt(20, "min:18");
// Pass

Abolish.attempt(10, "min:18");
// Error: Variable is too small. (Min. 18)

// Also accepts a valid string number.
Abolish.attempt("20", "min:18");
// Pass
```

### minLength

Similar to [min](#min), but for **strings**

```javascript
Abolish.attempt("password", "minLength:6");
// Pass

Abolish.attempt("pass", "minLength:6");
// Error: Variable is too short. (Min. 6 characters)
```

### object

Validate the object using abolish

```javascript
const data = {
    name: "John",
    address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA"
    }
};

Abolish.attempt(data, {
    name: "required|string",
    // WRONG!!! Cannot validate address object
    // abolish will assume `street`, `city` and `state` are rules.
    address: {
        street: "required|string",
        city: "required|string",
        state: "required|string"
    }
});

// The right way to validate an object
Abolish.attempt(data, {
    name: "required|string",
    address: {
        object: {
            street: "required|string",
            city: "required|string",
            state: "required|string"
        }
    }
});
```

### required

Checks if value is not `undefined` or `null`. if value is of type `string` or `array` it checks if the length is greater
than `0`

```javascript
Abolish.attempt(undefined, "required");
// Error: Variable is required.

Abolish.attempt(null, "required");
// Error: Variable is required.

Abolish.attempt("", "required");
// Error: Variable is required

Abolish.attempt([], "required");
// Error: Variable is required
```

### typeof

Checks if value is of type defined in validation option.

```javascript
Abolish.attempt(10, "typeof:number");
// Pass

Abolish.attempt("string", "typeof:array");
// Error: Variable is not typeOf array
```

### type

Alias for [typeof](#typeof)

### $inline

###### Note: Validators starting with `$` are considered special validators.

The $inline validator provides a way to validate without pre-defining a validator.

```javascript
// Syntax
Abolish.attempt(value, { $inline: () => boolean | error });

// Example
Abolish.attempt("mail.example.com", {
    $inline: (value) => {
        // validate email adddress
        if (!value.includes("@")) {
            throw new Error("Invalid email address");
        }
    }
});
// Error: Invalid email address
```
