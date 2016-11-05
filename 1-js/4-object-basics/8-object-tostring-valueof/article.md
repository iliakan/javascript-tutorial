
# Object to primitive conversion

In the chapter <info:type-conversions> we've seen the rules for numeric, string and boolean conversions.

But we left a gap for objects. Now let's close it. And, in the process, we'll see few other built-in methods and the example of a built-in symbol.

[cut]

For objects, there's a special additional conversion algorithm called [ToPrimitive](https://tc39.github.io/ecma262/#sec-toprimitive). When an object is used in an operation that requires a primitive, it is converted using this algorithm.

`ToPrimitive` has three modes of work, depending on the context of conversion. They are determined by so-called `hint` string. 

The 3 possible hints are:

1. `"string"` -- in case of a string conversion.
2. `"number"` -- in case of a numeric conversion.
3. There is also a rare `"default"` hint which is used by binary addition `"+"` and equality check `"=="` operators, because it's unclear what we need in these cases. Other arithmetic operators and comparisons use `"number"`. Most of the time `"default"` is implemented the same way as `"number"`.

...And of course we can customize how `ToPrimitive` works for an object.

Now, the important thing is: `hint` only "hints" which type is preferred. `ToPrimitive` may return a primitive value of any type. Then the conversion may continue using primitive rules described in the chapter [](info:type-conversions).

We'll see the examples right now.

## Symbol.toPrimitive

`ToPrimitive` for an object can be described by the method named `Symbol.toPrimitive`. It only has one argument: `hint`, and the object is accessible as `this`.

For instance, here we describe the conversion for object `user`:

```js run
let user = {
  name: 'John',
  age: 30,

*!*
  [Symbol.toPrimitive](hint) {
*/!*
    alert(`hint:${hint}`);

    switch(hint) {
    case "string":
      return this.name;
    case "number":
    case "default":
      return this.age;
    }
  }

};

*!*
// hint:string for outputting an object
alert(user);  // John

// hint:number for arithmetics
alert(user * 2); // 60 (30 * 2)

// the rare hint:default in equality test
alert(user == 30); // true (30 == 30)
*/!*
```

As we can see, the `user` is converted differently depending on what's needed: 

- For outputting an object we have `"string"` hint.
- For arithmetics we have `"number"` hint.
- For `==` we have `"default"` hint.

Please note that there's no way to customize `ToBoolean` conversion. An object is always truthy.

Also please note that the result of `Symbol.toPrimitive` must be primitive. The type is not enforced (not exactly the hinted one). But it must not an object: returning an object would give an error.

For instance, here `ToPrimitive` is written in a way that returns a string for any transform:

```js run
let user = {
  name: "John",

  [Symbol.toPrimitive](hint) {
    return this.name;
  }

};

*!*
// any toPrimitive transform returns a string
alert(user);  // John
alert(user + 123); // John123
*/!*
```

That's actually pretty common to implement a single conversion, the one that is really needed.

## Old school: toString and valueOf

Before the specification introduced `Symbol.toPrimitive`, there were other methods to customize the conversion. Namely, `toString` for the string conversion and `valueOf` for the numeric one.

They still work and can be used instead of `Symbol.toPrimitive`.

If there's no `Symbol.toPrimitive`, then the conversion does the following:

- For `hint="string"` in the absence of `Symbol.toPrimitive`:

  1. Call the method `obj.toString()` if it exists.
  2. If the result is a primitive, return it.
  3. Call the method `obj.valueOf()` if it exists.
  4. If the result is a primitive, return it.
  5. Otherwise `TypeError` (conversion failed)

- For `hint="number"` and `hint="default"`: the same, but `valueOf()` is checked before `toString()`:

  1. Call the method `obj.valueOf()` if it exists.
  2. If the result is a primitive, return it.
  3. Call the method `obj.toString()` if it exists.
  4. If the result is a primitive, return it.
  5. Otherwise `TypeError` (conversion failed)

Let's see an example. Here we implement our own string conversion for `user`:

```js run
let user = {
  name: 'John',

*!*
  toString() {
    return `User ${this.name}`;
  }
*/!*

};

*!*
alert(user);  // User John
alert(+user); // NaN
*/!*
```

Looks much better than the default `[object Object]`, right? As we don't have `valueOf` here, the object will be converted to `"User John"` when doing maths as well. So `+user` performs an additional conversion step from `"User John"` to a number, thus yielding `NaN`.

Now let's add a custom numeric conversion with `valueOf`:

```js run
let user = {
  name: 'John',
  age: 30,

  toString() {
    return `User ${this.name}`;
  }

*!*
  valueOf() {
    return this.age;
  }
*/!*

};

alert(user); // User John
*!*
alert(+user);  // 30
*/!*
```

```smart header="Practical use"
In most projects, only `toString()` method is used, because objects are printed out (especially for debugging) much more often than added/substracted/etc.

If only `toString()` is implemented, then both string and numeric conversions use it.
```

## Built-ins

Javascript has many built-in objects. Most of them implement `toString` is implemented in them.

As we've already seen, arrays have `toString` that returns a comma-separated list of elements.

That's why here when we add something to an array, we get strings as a result:

```js run
alert( [1,2] + 3 ); // '1,23'
alert( [] + 1 ); // '1'  (empty string + 1)
```

Other built-ins have their `toString` as well.

```js run
// running ahead: the example with Date and Error objects
alert( new Date() ); // current date and time
alert( new Error("wops!")); // Error: wops!
```

We'll study these objects in more details in later chapters.


## Bonus: Object toString for the type

We already know that plain objects are converted to string as `[object Object]`:

```js run
let obj = {};

alert(obj); // [object Object]
alert(obj.toString()); // the same
```

That's their implementation of `toString`. But there's a hidden feature thank makes `toString` actually much more powerful than that. We can use it as an extended `typeof`.

Sounds strange? Indeed. Let's demistify.

By [specification](https://tc39.github.io/ecma262/#sec-object.prototype.tostring), the built-in `toString` can be extracted from the object and executed in the context of any other value. And its result depends on that value.

- For a number, it will be `[object Number]`
- For a boolean, it will be `[object Boolean]`
- For `null`: `[object Null]`
- For `undefined`: `[object Undefined]`
- For arrays: `[object Array]`
- ...etc (customizable).

Let's demonstrate:

```js run
let objectToString = {}.toString; // extract toString method into a variable

// what type is this?
let arr = [];

alert( objectToString.call(arr) ); // [object Array]
```

Here we used [call](mdn:js/function/call) as described in the chapter [](info:object-methods#call-apply) to execute the function `objectToString` in the context `this=arr`.

Internally, the `toString` algorithm checks `this` and returns the corresponding result. More examples:

```js run
let s = {}.toString; // extract toString method into a variable

alert( s.call(123) ); // [object Number]
alert( s.call(null) ); // [object Null]
alert( s.call(alert) ); // [object Function]
```

```smart header="Method borrowing"
The technique when we take a method from one object and use it in the context of others is called "method borrowing".

So, we borrow `toString` from a plain object and apply it on other objects.
```
### Symbol.toStringTag

The behavior of Object `toString` can be customized using a special object property named `Symbol.toStringTag`.

For instance:

```js run
let user = {
  [Symbol.toStringTag]: 'User'
};

alert( {}.toString.call(user) ); // [object User]
```

For most environment-specific objects, there is such a property, for instance:

```js run
alert( window[Symbol.toStringTag] ); // window
alert( {}.toString.call(window) ); // [object Window]
```

As you can see, the result is exactly `Symbol.toStringTag` (if exists), wrapped into `[object ...]`.

At the end we have "typeof on steroids" that not only works for primitive data types, but also for built-in objects and even can be customized.
