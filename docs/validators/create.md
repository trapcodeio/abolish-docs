# Custom Validators

[comment]: <> (Creating custom **reusable** validators is easy with abolish.)

Abolish provides **two** validator spaces: **Global** and **Standalone**

A Global validator is available to all abolish instances, while a standalone validator is available to the instance it
was added to.

The standalone space gives you the ability to group and isolate related validators.

## Validator Object

<CodeGroup>
  <CodeGroupItem title="Sync Validator" active>

```typescript
const validator = {
    name: 'validatorName',
    error: `Optional validator error.`,
    validator: (value, option, helpers) => boolean  // or `AbolishError` or `void`
};

// Add To Global validators
Abolish.addGlobalValidator(validator);

// Or Add to standalone instance.
const abolish = new Abolish();
abolish.addValidator(validator);
```

  </CodeGroupItem>

  <CodeGroupItem title="Async Validator">

```typescript
const validator = {
    isAsync: true,
    name: 'validatorName',
    error: `Optional validator error.`,
    validator: async (value, option, helpers) => boolean  // or `AbolishError` or `void`
}

// Add To Global validators
Abolish.addGlobalValidator(validator)

// Or Add to standalone instance.
const abolish = new Abolish();
abolish.addValidator(validator)
```

  </CodeGroupItem>
</CodeGroup>

**Note:** The only difference between the `Sync` and `Async` validators is the `isAsync` parameter. Once set to true
will be considered as async.

### Validator Parameters

- `isAsync`: Required and must be set to **true** for async validators.
- `name`:  Used to make reference to the validator.
- `validator`:  The validation function. To fail a validation, this function must **throw an error** or **return false**
  .  <strong style="color: green">Anything else is considered a pass.</strong>
- `error`: Optional error message for the validator. Abolish will override it if an error is thrown in the validator
  function or if the `helper.error()` method is called

The `error` message can contain two keywords that will be parsed by abolish when found.

- **:param**  The key of the Object being validated or the name of the variable being validated
- **:option** The option passed to the validator in the rules object.

## Create a Validator

```javascript
/**
 * The syntax below creates a validator named `MyValidator`
 * And logs all the arguments it receives during validation.
 */
Abolish.addGlobalValidator({
  name: 'MyValidator',
  validator: (val, opt, helpers) => {
    // log all arguments
    console.log([val, opt, helpers])
    
    // fail by returning false.
    return false;
  },
  error: ':param failed myValidator'
})
```

### Validator Function Arguments

- **1st - val**: The value of the variable being validated.
- **2nd - opt**: The option passed to the validator in the rules object.
- **3rd - helpers**: An object containing the `error` and `modifier` helpers

Let's run some validation to see how `MyValidator` turns out.

```javascript
Abolish.attempt('value', 'MyValidator:option');

// will log
['value', 'option', {error, modifier}]

// And throw
// Error: Variable failed myValidator
```

Now that you have understood how the validator function works and the arguments it receives, you should be able to use
abolish perfectly.

### Pass/Fail Validation

Any validation will **pass** unless:

- **False** is returned.
- **Error** is thrown.
- **AbolishError** is returned.

<CodeGroup>

  <CodeGroupItem title="return">

```javascript
Abolish.addGlobalValidator({
  name: 'MyValidator',
  validator: (input) => input // return input.
})

Abolish.attempt(0, 'MyValidator'); //  pass
Abolish.attempt(null, 'MyValidator'); //  pass
Abolish.attempt(undefined, 'MyValidator'); // pass
Abolish.attempt(true, 'MyValidator'); // pass
Abolish.attempt(false, 'MyValidator'); // fail
```

  </CodeGroupItem>

  <CodeGroupItem title="void">

```javascript
Abolish.addGlobalValidator({
  name: 'MyValidator',
  validator: () => {
    // return nothing
  }
})

Abolish.attempt(null, 'MyValidator'); // void = pass
```

  </CodeGroupItem>

  <CodeGroupItem title="Error & AbolishError">

```javascript
Abolish.addGlobalValidator({
  name: 'MyValidator',
  validator: (input, opt, {error}) => {
    if (input === 'throw') {
      throw new Error('I was asked to throw an error!');
    } else if (input === 'error') {
      return error('Error returned!') // AbolishError
    }
  }
})

Abolish.attempt(undefined, 'MyValidator'); // pass

Abolish.attempt('throw', 'MyValidator'); // Fail
// Error: I was asked to throw an error!

Abolish.attempt('error', 'MyValidator'); // Fail
// Error: Error returned!
```

  </CodeGroupItem>
</CodeGroup>

### Modifying Data

Abolish provides a helper method for modifying the current data being validated. For example:

<CodeGroup>
  <CodeGroupItem title="Validator">

```javascript
Abolish.addGlobalValidator({
  name: 'ValidateEmail',
  validator: (email, opt, {modifier}) => {
    
    // Validate email using regex
    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)) {
      throw new Error('Email is invalid!')
    }
    
    // Change value to lowercase.
    modifier.setThis(email.toLowerCase())
  }
})
```

  </CodeGroupItem>

  <CodeGroupItem title="variable">

```javascript
const email = 'ADAM@example.com';
const newEmail = Abolish.attempt(email, 'ValidateEmail');

console.log([email, newEmail]);
// Will log:
["ADAM@example.com", "adam@example.com"]
```

  </CodeGroupItem>

<CodeGroupItem title="object">

```javascript
const data = {
  email: "ADAM@example.com",
  password: "password"
};

const [err, validated] = Abolish.validate(data, {
  email: 'required|ValidateEmail',
  password: 'required|min:6'
})

console.log([data, validated]);
// Will log:
[
  {email: "ADAM@example.com", password: "password"}, // original
  {email: "adam@example.com", password: "password"} // modified.
]
```

  </CodeGroupItem>
</CodeGroup>

## Types

**Reference:** All types are defined in `abolish/src/Types.d.ts`

```typescript
/**
 * Validator function return type.
 */
type AbolishValidatorFunctionResult = boolean | AbolishError | void;

/**
 * Validator function helper context.
 */
type AbolishValidatorFunctionHelper = {
    error: (message: string, data?: any) => AbolishError;
    modifier: ObjectModifier;
};

/**
 * validator function structure.
 */
type AbolishValidatorFunction = (
    value: any,
    option: any,
    helpers: AbolishValidatorFunctionHelper
) => AbolishValidatorFunctionResult | Promise<AbolishValidatorFunctionResult>;

/**
 * Validator structure.
 */
type AbolishValidator = {
    name: string;
    validator: AbolishValidatorFunction;
    error?: string;
    isAsync?: boolean;
};
```