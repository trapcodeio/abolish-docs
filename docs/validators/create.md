# Create a validator

[comment]: <> (Creating custom **reusable** validators is easy with abolish.)

Abolish provides **two** validator spaces: **Global** and **Standalone**

A Global validator is available to all abolish instances, while a standalone validator is available to the instance it
was added to.

The standalone space gives you the ability to group and isolate related validators.

## Syntax

<CodeGroup>
  <CodeGroupItem title="Sync Validator">

```typescript
const validator = {
    name: 'validatorName',
    error: `Optional validator error.`,
    validator: (value, option, helpers) => boolean  // or `AbolishError` or `void`
};

// Add To Global validators
Abolish.addGlobalValidator(validator)

// Or Add to standalone instance.
const abolish = new Abolish();
abolish.addValidator(validator)
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

| Parameter | Description |
| --------- | ----------- |
| `isAsync` | Required and must be **true** for async validators. |
| `name` | The name of the validator is used to make reference to the validator. |
| `validator` | A function that runs the validation required. To fail a validation, this function must **throw an
error** or **return false**. Anything else is considered a pass. |
| `error` | Optional error message for the validator. It is optional because abolish will override it if an error is thrown in the validator function  or if the `helper.error()` method is called |

The `error` message can contain two keywords that will be parsed by abolish when found.

- **:param**  The key of the Object being validated or the name of the variable being validated
- **:option** The option passed to the validator in the rules object.

## Get Started

Let's create a validator named `MyValidator`

```javascript
Abolish.addGlobalValidator({
  name: 'MyValidator',
  validator: (...args) => {
    console.log(args)
    return false;
  },
  error: ':param failed myValidator'
})
```

The above syntax creates a validator named `myValidator` and logs all the arguments it receives during validation. Now
lets run some validation to see how this turns out.

```javascript
Abolish.attempt('value', 'MyValidator:option')

// will log
['value', 'option', {error, modifier}]

// And throw
// Error: Variable failed myValidator
```

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