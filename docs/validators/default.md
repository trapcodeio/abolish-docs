---
prev: /validation/rules.md
next: ./create.md
---

# Default Validators

Because Abolish is meant for **Custom validations** only **12 default validators** are available out of the box.

### Menu

- [default](#default)
- [exact](#exact)
- [max](#max)
- [maxLength](#maxlength)
- [min](#min)
- [minLength](#minlength)
- [size](#size)
- [object](#object)
- [objectAsync](#objectasync)
- [required](#required)
- [type](#type)
- [typeof](#typeof)

## Validators

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

Similar to [max](#max), but for **strings/array**

```javascript
Abolish.attempt("password", "maxLength:250");
// Pass

Abolish.attempt("This is a sentence", "maxLength:10");
// Error: Variable is too long. (Max. 10 characters)


Abolish.attempt(["a", "b", "c"], "maxLength:5");
// pass

Abolish.attempt(["a", "b", "c", "d"], "maxLength:2");
// Error: Variable lenght is too long. (Max. 2)
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

Similar to [min](#min), but for **strings/arrays**

```javascript
Abolish.attempt("password", "minLength:6");
// Pass

Abolish.attempt("pass", "minLength:6");
// Error: Variable is too short. (Min. 6 characters)

Abolish.attempt(["a", "b", "c"], "minLength:2");
// Pass

Abolish.attempt(["a"], "minLength:2");
// Error: Variable lenght is too short. (Min. 2)
```

### size
Check if the length of a variable (String, Array or Object) is equal to the option given.

```javascript
// String
Abolish.test("hello", "size:5")); // true
Abolish.test("hello", "size:4")); // false

// Array
Abolish.test([1, 2, 3], "size:3")); // true
Abolish.test([1, 2, 3], "size:2")); // false

// Object
Abolish.test({ a: 1, b: 2, c: 3 }, "size:3")); // true
Abolish.test({ a: 1, b: 2, c: 3 }, "size:2")); // false
```

Size also supports using an array of numbers as option for multiple sizes.

```javascript
Abolish.test(["a", "b", "c"], {size: [2, 3]}); // true


Abolish.test(["a", "b", "c", "d"], {size: [2, 3]}); // false
// The example above will fail becasue the array has 4 elements.
// and the size option is either [2, 3]
```

### object

- Check if the variable is an object.
- Validate an object using abolish rules.

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
    // ❌ WRONG!!! Cannot validate address object
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
    // ✅ RIGHT!!! Using object rule syntax
    address: {
        object: {
            street: "required|string",
            city: "required|string",
            state: "required|string"
        }
    }
});
```

### objectAsync

- Check if the variable is an object.
- Validate an object using abolish async rules.

```javascript
const address = {
    street: "123 Main St",
    cordinates: {
        lat: "123",
        lng: "456"
    }
};

Abolish.attemptAsync(address, {
    objectAsync: {
        // ...
        cordinates: "An_Async_Cordinates_Validator"
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

The typeof can also check for multiple types.

```javascript
// using comma separated string
Abolish.test(10, "typeof:number,string"); // true
Abolish.test("string", "typeof:number,string"); // true
Abolish.test(true, "typeof:number,string"); // false

// using array
Abolish.test(10, {typeof: ["number", "string"]}); // true
Abolish.test("string", {typeof: ["number", "string"]}); // true
Abolish.test(true, {typeof: ["number", "string"]}); // false
```

### type

Alias for [typeof](#typeof)
