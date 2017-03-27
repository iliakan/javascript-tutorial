# Object methods, "this"

Objects are usually created to represent entities of the real world, like users, orders and so on:

```js
let user = {
  name: "John",
  age: 30
};
```

And, in the real world, a user can `act`: to select something from the shopping cart, to login, to logout etc.

Let's implement the same in JavaScript using functions in properties.

[cut]

## Method examples

For the start, let's teach the `user` to say hello:

```js run
let user = {
  name: "John",
  age: 30
};

*!*
user.sayHi = function() {
  alert("Hello!");
};
*/!*

user.sayHi(); // Hello!
```

Here we've just used a Function Expression to create the function and assign it to the property `user.sayHi` of the object.

Then we can call it. The user now can speak!

A function that is the property of an object is called its *method*.

So, here we've got a method `sayHi` of the object `user`.

Of course, we could use a Function Declaration to add a method:

```js run
let user = {
  // ...
};

*!*
// first, declare
function sayHi() {
  alert("Hello!");
};

// then add the method
user.sayHi = sayHi;
*/!*

user.sayHi(); // Hello!
```

That would also work, but is longer. Also we get an "extra" function `sayHi` outside of the `user` object. Usually we don't want that.

```smart header="Object-oriented programming"
When we write our code using objects to represent entities, that's called an [object-oriented programming](https://en.wikipedia.org/wiki/Object-oriented_programming), in short: "OOP".

OOP is a big thing, an interesting science of its own. How to choose the right entities? How to organize the interaction between them? That's architecture.
```
### Method shorthand

There exists a shorter syntax for methods in an object literal:

```js
// these objects do the same

let user = {
  sayHi: function() {
    alert("Hello");
  }
};

// method shorthand looks better, right?
let user = {
*!*
  sayHi() { // same as "sayHi: function()"
*/!*
    alert("Hello");
  }
};
```

As demonstrated, we can omit `"function"` and just write `sayHi()`.

To say the truth, the notations are not fully identical. There are subtle differences related to object inheritance (to be covered later), but for now they do not matter. In almost all cases the shorter syntax is preferred.

## "this" in methods

It's common that an object method needs to access the information stored in the object to do its job.

For instance, `user.sayHi()` may need to mention the name of the user.

**To access the object, a method can use the `this` keyword.**

The value of `this` is the object "before dot", the one used to call the method.

For instance:

```js run
let user = {
  name: "John",
  age: 30,

  sayHi() {
*!*
    alert( this.name ); // "this" means "this object"
*/!*
  }

};

user.sayHi(); // John
```

Here during the execution of `user.sayHi()`, the value of `this` will be `user`.

Technically, it's also possible to access the object without `this`:

```js
...
  sayHi() {
    alert( *!*user.name*/!* );
  }
...
```

...But such code is unreliable. If we decide to copy `user` to another variable, e.g. `admin = user` and overwrite `user` with something else, then it will access the wrong object.

That's demonstrated below:

```js run
let user = {
  name: "John",
  age: 30,

  sayHi() {
*!*
    alert( user.name ); // leads to an error
*/!*
  }

};


let admin = user;
user = null; // overwrite to make things obvious

admin.sayHi(); // whoops! inside sayHi(), the old name is used! error!
```

If we used `this.name` instead of `user.name` inside the `alert`, then the code would work.

## "this" is not bound

In JavaScript, "this" keyword behaves unlike most other programming languages. First, it can be used in any function.

There's no syntax error in the code like that:

```js
function sayHi() {
  alert( *!*this*/!*.name );
}
```

The value of `this` is evaluated during the run-time. And it can be anything.

For instance, the same function may have different "this" when called from different objects:

```js run
let user = { name: "John" };
let admin = { name: "Admin" };

function sayHi() {
  alert( this.name );
}

*!*
// use the same functions in two objects
user.f = sayHi;
admin.f = sayHi;
*/!*

// these calls have different this
// "this" inside the function is the object "before the dot"
user.f(); // John  (this == user)
admin.f(); // Admin  (this == admin)

admin['f'](); // Admin (dot or square brackets access the method – doesn't matter)
```

Actually, we can call the function without an object at all:

```js run
function sayHi() {
  alert(this);
}

sayHi();
```

In this case `this` is `undefined` in strict mode. If we try to access `this.name`, there will be an error.

In non-strict mode (if you forgot `use strict`) the value of `this` in such case will be the *global object* (`"window"` for browser, we'll study it later). This is just a historical thing that `"use strict"` fixes.

Please note that usually a call of a function using `this` without an object is not normal, but rather a programming mistake. If a function has `this`, then it is usually meant to be called in the context of an object.

```smart header="The consequences of unbound `this`"
If you come from another programming languages, then you are probably used to an idea of a "bound `this`", where methods defined in an object always have `this` referencing that object.

The idea of unbound, run-time evaluated `this` has both pluses and minuses. From one side, a function can be reused for different objects. From the other side, greater flexibility opens  a place for mistakes.

Here we are not to judge whether this language design decision is good or bad. We will understand how to work with it, how to get benefits and evade problems.
```

## Internals: Reference Type

```warn header="In-depth language feature"
This section covers advanced topic that may interest those who want to know JavaScript better.

If you want to go on faster, it can be skipped or postponed.
```

An intricate method call can loose `this`, for instance:

```js run
let user = {
  name: "John",
  hi() { alert(this.name); },
  bye() { alert("Bye"); }
};

user.hi(); // John (the simple call works)

*!*
// now let's call user.hi or user.bye depending on the name
(user.name == "John" ? user.hi : user.bye)(); // Error!
*/!*
```

On the last line there is an intricate code that evaluates an expression to get the method. In this case the result is `user.hi`.

The method is immediately called with brackets `()`. But that doesn't work right. You can see that the call results in an error, cause the value of `"this"` inside the call becomes `undefined`.

Actually, anything more complex than a simple `obj.method()` (or square brackets here) looses `this`.

If we want to understand why it happens -- let's get under the hood of how `obj.method()` call works.

Looking closely, we may notice two operations in `obj.method()` statement:

- the dot `'.'` retrieves the property `obj.method`.
- brackets `()` execute it (assuming that's a function).

So, you might have already asked yourself, why does it work? That is, if we put these operations on separate lines, then `this` will be lost for sure:

```js run
let user = {
  name: "John",
  hi() { alert(this.name); }
}

*!*
// split getting and calling the method in two lines
let hi = user.hi;
hi(); // Error, because this is undefined
*/!*
```

That's because a function is a value of its own. It does not carry the object. So `hi = user.hi` saves it into the variable, and then on the last line it is completely standalone.

**To make `user.hi()` calls work, JavaScript uses a trick -- the dot `'.'` returns not a function, but a value of the special [Reference Type](https://tc39.github.io/ecma262/#sec-reference-specification-type).**

The Reference Type is a "specification type". We can't explicitly use it, but it is used internally by the language.

The value of Reference Type is a three-value combination `(base, name, strict)`, where:

- `base` is the object.
- `name` is the property.
- `strict` is true if `use strict` is in effect.

The result of a property access `'.'` is a value of Reference Type. For `user.hi` in strict mode it is:

```js
// Reference Type value
(user, "hi", true)
```

When brackets `()` are called on the Reference Type, they receive the full information about the object and it's method, and can set the right `this` (`=user` in this case).

Any other operation like assignment `hi = user.hi` discards the reference type as a whole, takes the value of `user.hi` (a function) and passes it on. So any further operation "looses" `this`.

So, as the result, the value of `this` is only passed the right way if the function is called directly using a dot `obj.method()` or square brackets `obj[method]()` syntax (they do the same here).

## Arrow functions have no "this"

Arrow functions are special: they don't have "own" `this`. If we reference `this` from such function, it's taken from the outer "normal" function.

For instance, here `arrow()` uses `this` from the outer `user.sayHi()` method:

```js run
let user = {
  firstName: "Ilya",
  sayHi() {
    let arrow = () => alert(this.firstName);
    arrow();
  }
};

user.sayHi(); // Ilya
```

That's a special feature of arrow functions, it's useful when we actually do not want to have a separate `this`, but rather to take it from the outer context. Later in the chapter <info:arrow-functions> we'll dig more deeply into what's going on.


## Summary

- Functions that are stored in object properties are called "methods".
- Methods allow objects to "act" like `object.doSomething()`.
- Methods can reference the object as `this`.

The value of `this` is defined at run-time.
- When a function is declared, it may use `this`, but that `this` has no value until the function is called.
- That function can be copied between objects.
- When a function is called in the "method" syntax: `object.method()`, the value of `this` during the call is `object`.

Please note that arrow functions are special: they have no `this`. When `this` is accessed inside an arrow function -- it is taken from outside.
