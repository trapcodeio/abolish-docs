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

The example below shows how to use Abolish to **validate** a variable using out of the box validators `typeof` & `min`

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

Validation rules can also be written as follows:

```javascript
// String
Abolish.attempt(age, "typeof:number|min:18")
// Object
Abolish.attempt(age, {typeof: "number", min: 18})
// Or Array of Strings or Objects
Abolish.attempt(age, ["typeof:number", {min: 18}])
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
- Loops through the keys accordingly.
- Finds the corresponding validator using the key.
- Run the validator function, using the value of the rule as the 2nd validator argument.

### Sync Example

Let's add a validator function that checks if a file exists.

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

Let's add an async validator function that checks an imaginary database if email belongs to a user.

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
await Abolish.attemptAsync('admin@example.com', 'EmailBelongsToUser')
// if it passes 
"admin@example.com" // will be returned
// Else Error will be thrown.
`Email "admin@example.com" does not belong to user.`
```

