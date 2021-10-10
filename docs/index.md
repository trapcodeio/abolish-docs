# Abolish Validator

[Github](https://github.com/trapcodeio/abolish)
|
[Npm](https://www.npmjs.com/package/abolish)
|
[Yarn](https://yarn.pm/abolish)

Abolish provides a very simple API for developers to make both **Sync** and **Async** validations on javascript
variables.

Unlike other validation libraries, Abolish is more focused on **custom validations**.

You can create your own validation library using abolish and use them in as many projects as you like.

**You validate your data just the way you understand them.**

## Installation

Using **npm** OR **yarn**

```bash
npm install abolish
# OR
yarn add abolish
```

After Installation, you can **require** or **import**  Abolish class like so:

```javascript
const {Abolish} = require("abolish");
// OR 
import {Abolish} from "abolish";
```

## Basic Example

| Methods | Description |
| ------ | ----------- |
| **`attempt`** | Validate variable, Throw error when validation fails. |
| **`check`** | Validate variable but use **Go Lang** error handling style. No Error thrown. |
| **`validate`** | Validate **objects** and use **Go Lang** error handling style. No Error thrown. |

<br>

<CodeGroup>
  <CodeGroupItem title="attempt">

```javascript
const {Abolish} = require("abolish")
const age = 17;

try {
  Abolish.attempt(age, "typeof:number|min:18")
} catch (e) {
  console.log(e.message)
  // Variable is too small. (Min. 18)
}
```

  </CodeGroupItem>

  <CodeGroupItem title="check" >

```javascript
const {Abolish} = require("abolish");

const [err, age] = Abolish.check(17, "typeof:number|min:18");

if (err) {
  console.log(e.message)
  // Error: Variable is too small. (Min. 18)
}
```

  </CodeGroupItem>

  <CodeGroupItem title="validate">

```javascript
const {Abolish} = require("abolish");

const data = {
  name: 'John Doe',
  password: 'password',
  age: 17
}

const [err, validated] = Abolish.validate(data, {
  name: 'typeof:string|minLength:2|maxLength:30',
  password: 'typeof:string|minLength:10|maxLength:250',
  age: 'typeof:number|min:18',
});

if (err) {
  console.log(e.message)
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
Abolish.attempt(variable, {typeof: "number", min: 18});
// Or Array of Strings or Objects
Abolish.attempt(variable, ["typeof:number", {min: 18}]);
```

## How it Works?

To fully explore abolish, you need to understand what it does behind the scenes.

Basically rules are converted to an object before validation starts. Where the `keys` are validator names and `values`
are validator options. For example

```javascript
"typeof:number|min:18"
// Is converted to.
// {typeof: "number", min: 18}
```

`typeof` and `min` are validators while `number` and `18` are their validation options.

Process Cycle:

- Parse rules if not an object.
- Reads the rules object.
- Finds the corresponding validators using rules object keys.
- Run the validator functions.

### Sync Example

A validator function that checks if a file exists.

```javascript
Abolish.addGlobalValidator({
  name: 'FileExists', // Case Sensitive.
  error: `File does not exist!`,
  validator: (file) => fs.existsSync(file),
})
```

We can run the `FileExists` validator like so.

```javascript
Abolish.attempt('/path/to/file.png', 'FileExists')
// if it passes 
"/path/to/file.png" // will be returned
// Else Error will be thrown.
"File does not exist!"
```

### Async Example.

An async validator function that checks if an email belongs to a user.

```javascript
Abolish.addGlobalValidator({
  isAsync: true, // Must set for async validators
  name: 'EmailBelongsToUser',
  validator: async (email) => {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error(`Email "${email}" does not belong to user.`)
    }
  }
})
```

We can run the async `EmailBelongsToUser` validator like so.

```javascript
await Abolish.attemptAsync('admin@example.com', 'EmailBelongsToUser');
// if it passes 
"admin@example.com"; // will be returned
// Else Error will be thrown.
`Email "admin@example.com" does not belong to user.`
```

