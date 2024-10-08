---
prev: false
next: /validation/methods.md
---

# Abolish Validator

[GitHub](https://github.com/trapcodeio/abolish)
|
[Npm](https://www.npmjs.com/package/abolish)
|
[Yarn](https://yarn.pm/abolish)

Abolish provides a very simple API for developers to make both **Sync** and **Async** validations on javascript
variables.

Unlike other validation libraries, Abolish is more focused on **custom validations**.

You can create your own validation library with abolish and use them in as many projects as you like.

**You validate your data just the way you understand them.**

## Installation

Abolish can be used directly in browsers or in node.js via package managers or bundlers.

### Package Managers

Using **npm** OR **yarn**

```bash
npm install abolish
# OR
yarn add abolish
```

After Installation, you can **require** or **import** Abolish class like so:

```javascript
const { Abolish } = require("abolish");
// OR
import { Abolish } from "abolish";
```

### Browser Setup

```html
<script src="https://cdn.jsdelivr.net/npm/abolish/browser.min.js"></script>

<!-- Usage -->
<script>
    const { Abolish } = AbolishBrowser; // as window.AbolishBrowser
</script>
```

## Basic Example

| Methods        | Description                                                                     |
| -------------- | ------------------------------------------------------------------------------- |
| **`attempt`**  | Validate variable, Throw error when validation fails.                           |
| **`check`**    | Validate variable but use **Go Lang** error handling style. No Error thrown.    |
| **`test`**     | Validate variable, return boolean. `true` for pass and `false` for fail         |
| **`validate`** | Validate **objects** and use **Go Lang** error handling style. No Error thrown. |

<br>

<CodeGroup>
  <CodeGroupItem title="attempt">

```javascript
const { Abolish } = require("abolish");
const age = 17;

try {
    Abolish.attempt(age, "typeof:number|min:18");
} catch (e) {
    console.log(e.message);
    // Variable is too small. (Min. 18)
}
```

  </CodeGroupItem>

  <CodeGroupItem title="check" >

```javascript
const { Abolish } = require("abolish");

const [err, age] = Abolish.check(17, "typeof:number|min:18");

if (err) {
    console.log(e.message);
    // Error: Variable is too small. (Min. 18)
}
```

  </CodeGroupItem>

 <CodeGroupItem title="test" >

```javascript
const { Abolish } = require("abolish");

const validAge = Abolish.test(17, "typeof:number|min:18"); // `false`

if (!validAge) {
    // do something...
}
```

  </CodeGroupItem>

  <CodeGroupItem title="validate">

```javascript
const { Abolish } = require("abolish");

const data = {
    name: "John Doe",
    password: "password",
    age: 17
};

const [err, validated] = Abolish.validate(data, {
    name: "typeof:string|minLength:2|maxLength:30",
    password: "typeof:string|minLength:10|maxLength:250",
    age: "typeof:number|min:18"
});

if (err) {
    console.log(e.message);
    // Error: Password is too short. (Min. 10 characters)
}
```

  </CodeGroupItem>
</CodeGroup>

Validation rules can also be written as follows:

```javascript
// String
Abolish.attempt(variable, "typeof:number|min:18");
// Object
Abolish.attempt(variable, { typeof: "number", min: 18 });
// Or Array of Strings or Objects
Abolish.attempt(variable, ["typeof:number", { min: 18 }]);
```

## How it Works?

To fully explore abolish, you need to understand what it does behind the scenes.

Basically rules are converted to an object before validation starts. Where the `keys` are validator names and `values`
are validator options. For example

```javascript
"typeof:number|min:18";
// Is converted to.
// {typeof: "number", min: 18}
```

`typeof` and `min` are validators while `number` and `18` are their validation options.

Process Cycle:

-   Parse rules if not an object.
-   Reads the rules object.
-   Finds the corresponding validators using rules object keys.
-   Run the validator functions.

### Sync Example

A validator function that checks if a file exists.

```javascript
Abolish.addGlobalValidator({
    name: "FileExists", // Case Sensitive.
    error: `File does not exist!`,
    validator: (file) => fs.existsSync(file)
});
```

We can run the `FileExists` validator like so.

```javascript
Abolish.attempt("/path/to/file.png", "FileExists");
// if it passes
("/path/to/file.png"); // will be returned
// Else Error will be thrown.
("File does not exist!");
```

### Async Example.

An async validator function that checks if an email belongs to a user.

```javascript
Abolish.addGlobalValidator({
    isAsync: true, // Must set for async validators
    name: "EmailBelongsToUser",
    validator: async (email) => {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw new Error(`Email "${email}" does not belong to user.`);
        }
    }
});
```

We can run the async `EmailBelongsToUser` validator like so.

```javascript
await Abolish.attemptAsync("admin@example.com", "EmailBelongsToUser");
// if it passes
("admin@example.com"); // will be returned
// Else Error will be thrown.
`Email "admin@example.com" does not belong to user.`;
```

## Go Fast!! 🚀🚀
Abolish can be **70% faster** when using **compiled** schemas.

When running validations, all the cycles (e.g parsing rules, mapping rules to validator functions) are repeated for each validation. 
This can be slow when running multiple validations.

With compiled schemas, the cycles are done once and the compiled schema is used for all validations.

### Features 
Compiled schemas:

- Includes all validators in the schema.
- Builds a standalone validator function that does not require the Abolish class to run.
- Faster when running multiple validations.


### Usage
For validating **`variables`**, you can compile the schema using the **`Abolish.compile`** function

```js
const AgeSchema = Abolish.compile("typeof:number|min:18");

// use the compiled schema standalone
const [err, val] = AgeSchema.validate(17);

// use with abolish
const [err, val] = Abolish.check(17, AgeSchema);
```

For validating **`objects`**, you can compile the schema using the **`Abolish.compileObject`** function

```js
const UserSchema = Abolish.compileObject({
    email: "required|typeof:string",
    password: "required|typeof:string|minLength:6"
});

// use the compiled schema standalone
const [err, val] = UserSchema.validate(form);

// use with abolish
const [err, val] = Abolish.validate(form, UserSchema);
```

### More Details
See the [`AbolishCompiled`](./validation/compiled.md) class for usage and methods.
