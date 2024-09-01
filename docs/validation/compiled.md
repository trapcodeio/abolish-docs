# Abolish Compiled
`Abolish Compiled` is a feature that allows you to compile your validation rules into a schema that can be reused for multiple validations.

It is **70% faster** than running validations without compiled schemas.


### Compile Variable Schema
```js
const StrongPassword = Abolish.compile({
    typeof: "string",
    minLength: 6,
})

const [err, val] = StrongPassword.validate("123456");
```

### Compile Object Schema
```js
const LoginSchema = Abolish.compile({
    email: "required|typeof:string",
    password: "required|typeof:string|minLength:6"
});

const [err, val] = LoginSchema.validate(Form);
```

