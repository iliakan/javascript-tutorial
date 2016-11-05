# Functions

Quite often we need to perform a similar action in many places of the script.

For example, we need to show a nice-looking message when a visitor logs in, logs out and maybe somewhere else.

Functions are the main "building blocks" of the program. They allow the code to be called many times without repetition.

[cut]

We've already seen examples of built-in functions, like `alert(message)`, `prompt(message, default)` and `confirm(question)`. But we can create functions of our own as well.

## Function Declaration

To create a function we can use a *function declaration*.

It looks like this:

```js
function showMessage() {
  alert( 'Hello everyone!' );
}
```

The `function` keyword goes first, then goes the *name of the function*, then a list of *parameters* in the brackets (empty in the example above) and finally the code of the function, also named "the function body".

![](function_basics.png)

Our new function can be called by it's name.

For instance:

```js run
function showMessage() {
  alert( 'Hello everyone!' );
}

*!*
showMessage();
showMessage();
*/!*
```

The call `showMessage()` executes the code of the function. Here we will see the message two times.

This example clearly demonstrates one of the main purposes of the functions: to evade code duplication.

If we ever need to change the message or the way it is shown -- it's enough to modify the code in one place: the function which outputs it.

## Local variables

A variable declared inside a function is only visible inside that function.

For example:

```js run
function showMessage() {
*!*
  let message = "Hello, I'm JavaScript!"; // local variable
*/!*

  alert( message );
}

showMessage(); // Hello, I'm JavaScript!

alert( message ); // <-- Error! The variable is local to the function
```

## Outer variables

A function can access an outer variable as well, for example:

```js run no-beautify
let *!*userName*/!* = 'John';

function showMessage() {
  let message = 'Hello, ' + *!*userName*/!*;
  alert(message);
}

showMessage(); // Hello, my name is John
```

The function has a full access to an outer variable. It can modify it as well.

For instance:

```js run
let *!*userName*/!* = 'John';

function showMessage() {
  *!*userName*/!* = "Bob"; // (1) changed the outer variable

  let message = 'Hello, ' + *!*userName*/!*;
  alert(message);
}

alert( userName ); // *!*John*/!* before the function call

showMessage();

alert( userName ); // *!*Bob*/!*, the value was modified by the function
```

Sometimes that happens when we forget `let`. Because the outer variable is only used if there's no local one.

For example, if we had `let` before `userName` in the line (1) then the function would have a local variable `userName` and use it instead. This process is called "shadowing".

In the code below the local `userName` *shadows* the outer one:

```js run
let userName = 'John';

function showMessage() {
*!*
  let userName = "Bob"; // declare a local variable
*/!*

  let message = 'Hello, ' + userName; // *!*Bob*/!*
  alert(message);
}

// the function will create and use it's own userName
showMessage();

alert( userName ); // *!*John*/!*, unchanged, the function did not access the outer variable
```

```smart header="Global variables"
Variables declared outside of any function, such as the outer `userName` in the code above, are called *global*.

Global variables are visible from any function (unless shadowed by locals).

Usually, a function declares all variables specific to its task, and global variables only store the data so important that it really must be seen from anywhere. Modern code has little to no globals, most variables reside in their functions.
```

## Parameters

We can pass arbitrary data to function using it's parameters (also called *function arguments*) .

In the example below, the function has two parameters: `from` and `text`.

```js run
function showMessage(*!*from, text*/!*) { // arguments: from, text
  alert(from + ': ' + text);
}

*!*
showMessage('Ann', 'Hello!'); // Ann: Hello!
showMessage('Ann', "What's up?"); // Ann: What's up?
*/!*
```

When the function is called, the values in the brackets are copied to local variables `from` and `next`.

Please note that because the function can modify them. The changes are made to copies, so they won't affect anything outside:


```js run
function showMessage(from, text) {

*!*
  from = '*' + from + '*'; // make "from" look nicer
*/!*

  alert( from + ': ' + text );
}

let from = "Ann";

showMessage(from, "Hello"); // *Ann*: Hello

// the value of "from" is the same, the function modified a local copy
alert( from ); // Ann
```

The syntax of function parameters is very versatile.

It allows:

- To specify default values for the case if the parameter if missing.
- To gather parameters into an array.
- And more.

All these features aim to help us in writing good-looking and concise code.

### Default values

A function can be called with any number of arguments. If a parameter is not provided, but listed in the declaration, then its value becomes `undefined`.

For instance, the aforementioned function `showMessage(from, text)` can be called with a single argument:

```js
showMessage("Ann");
```

That's not an error. Such call would output `"Ann: undefined"`, because `text === undefined`.

If we want to use a "default" `text` in this case, then we can specify it after `=`:

```js run
function showMessage(from, *!*text = 'no text given'*/!*) {
  alert( from + ": " + text );
}

showMessage("Ann"); // Ann: no text given
```

Here `'no text given'` is a string, but it can be a more complex expression, which is only evaluated and assigned if the parameter is missing. So, this is also possible:

```js run
function showMessage(from, text = anotherFunction()) {
  // anotherFunction() only executed if no text given
}
```

````smart header="Default parameters old-style"
Old editions of Javascript did not support default parameters. So there are alternative ways to support them, that you can find mostly in the old scripts.

For instance, an explicit check for being `undefined`:

```js
function showMessage(from, text) {
*!*
  if (text === undefined) {
    text = 'no text given';
  }
*/!*

  alert( from + ": " + text );
}
```

...Or operator `||`:

```js
function showMessage(from, text) {
  // the argument is considered missing if it's falsy
  text = text || 'no text given';
  ...
}
```
````

### Arbitrary number of parameters

To support any number of parameters, we can use the rest operator `...`:

```js run
function sumAll(*!*...args*/!*) {
  let sum = 0;

  for(let arg of args) sum += arg;

  alert(sum);
}

sumAll(1); // 1
sumAll(1, 2); // 3
sumAll(1, 2, 3); // 6
```

Here `...args` means "gather all parameters into an array `args`".

We also can put few first arguments into variables and gather only the rest:

```js run
// titles will be an array of arguments from the 3rd one
function showName(firstName, lastName, ...titles) {
  alert( firstName + ' ' + lastName ); // Julius Caesar

  // titles = ["Consul", "Praetor", "Imperator"]
  alert( titles[0] ); // Consul
}

showName("Julius", "Caesar", "Consul", "Praetor", "Imperator");
```

````warn header="The rest operator `...` must be the last"
The rest operator `...` gathers all remaining arguments, so the following has no sense:

```js
function f(arg1, ...rest, arg2) { // arg2 after ...rest ?!
  // error
}
```

The `...rest` must always be the last.
````

````smart header="The `arguments` variable"

In old times, there was no rest operator. But there is a special variable named `arguments` that contains all arguments by their index. It is still supported and can be used like this:

```js run
function showName() {
  alert( arguments[0] );
  alert( arguments[1] );
  alert( arguments.length );
}

// shows: Julius, Caesar, 2
showName("Julius", "Caesar");
```

We can also use `for..of` to iterate over it.

The downside is that `arguments` looks like an array, but it's not a real array. It does not support many useful array methods that we'll study later. Also we can't use it to capture "the rest" of arguments starting from the given one.
````

### The spread operator [#spread-operator]

The rest operator `...` allows to gather parameters in the array.

But there's a reverse operator named "the spread". It has the same form three dots `...` and allows to pass  an array as a list of parameters in a function call.

Like this:

```js run
// we have array
let fullName = ["Gaius", "Julius", "Caesar"];

// the function has a list of arguments
function showName(firstName, secondName, lastName) {
  alert(firstName);
  alert(secondName);
  alert(lastName);
}

// The spread operator ... passes an array as a list of arguments
showName(...fullName);
```

To put it clear, if we used `showName(fullName)`, the function would receive a single argument -- the array `fullName`. The spread operator `showName(...fullName)` "unwraps" the array into multiple arguments.

As we can see, the rest and spread operators look the same. But the meaning is different.

There's a simple rule to distinguish them:
- When `...` occurs in function parameters, it's called a "rest operator" and gathers parameters into the array.
- When `...` occurs in a function call, it's called a "spread operator" and passes an array as the list of parameters.

Together they help to travel between a list and an array of parameters with ease.

When that may be useful?

Let's see a more real-life example.

There exists a built-in function [Math.max](mdn:js/Math/max) that takes a list of values and returns the greatest one:

```js run
alert( Math.max(5, 7, -8, 1) ); // 7
```

Imagine we have an array and want to select a maximum from it. Unfortunately, `Math.max` works with a list of parameters, not with arrays, so a direct call `Math.max(arr)` won't work. But we can use the spread operator `...` to pass the array as the list:


```js run
let arr = [5, 7, -8, 1];

alert( Math.max(...arr) ); // 7
```

We also can pass multiple arrays this way:

```js run
let arr1 = [1, -2, 3, 4];
let arr2 = [8, 3, -8, 1];

alert( Math.max(...arr1, ...arr2) ); // 8
```

...And even combine the spread operator with normal values:


```js run
let arr1 = [1, -2, 3, 4];
let arr2 = [8, 3, -8, 1];

alert( Math.max(1, ...arr1, 2, ...arr2, 25) ); // 25
```



## Returning a value

A function can return a value back into the calling code as the result.

The simplest example would be a function that sums two values:

```js run no-beautify
function sum(a, b) {
  *!*return*/!* a + b;
}

let result = sum(1, 2);
alert( result ); // 3
```

The directive `return` can be in any place of the function. When the execution reaches it, the function stops, and the value is returned to the calling code (assigned to `result` above).

There may be many occurences of `return` in a single function. For instance:

```js run
function checkAge(age) {
  if (age > 18) {
*!*
    return true;
*/!*
  } else {
*!*
    return confirm('Got a permission from the parents?');
*/!*
  }
}

let age = prompt('How old are you?', 18);

if ( checkAge(age) ) {
  alert( 'Access granted' );
} else {
  alert( 'Access denied' );
}
```

It is possible to use `return` without a value. That causes the function to exit immediately.

For example:

```js
function showMovie(age) {
  if ( !checkAge(age) ) {
*!*
    return;
*/!*
  }

  alert( "Showing you the movie" ); // (*)
  // ...
}
```

In the code above, if `checkAge(age)` returns `false`, then `showMovie` won't proceed to the `alert`.

````smart header="A function with an empty `return` or without it returns `undefined`"
If a function does not return a value, it is the same as if it returns `undefined`:

```js run
function doNothing() { /* empty */ }

alert( doNothing() === undefined ); // true
```

An empty `return` is also the same as `return undefined`:

```js run
function doNothing() {
  return;
}

alert( doNothing() === undefined ); // true
```
````

## Naming a function [#function-naming]

Functions are actions. So their name is usually a verb. It should briefly, but as accurately as possible describe what the function does. So that a person who reads the code gets the right clue.

It is a widespread practice to start a function with a verbal prefix which vaguely describes the action. There must be an agreement within the team on the meaning of the prefixes.

For instance, functions that start with `"show"` -- usually show something.

Function starting with...

- `"get"` -- allow to get something,
- `"calc"` -- calculate something,
- `"create"` -- create something,
- `"check"` -- check something and return a boolean, etc.

Examples of such names:

```js no-beautify
showMessage(..)     // shows a message
getAge(..)          // returns the age (gets it somehow)
calcSum(..)         // calculates a sum and returns the result
createForm(..)      // creates a form (and usually returns it)
checkPermission(..) // checks a permission, returns true/false
```

With prefixes at place, a glance at a function name gives an understanding what kind of work it does and what kind of value it returns.

```smart header="One function -- one action"
A function should do exactly what is suggested by its name, no more.

Two independant actions usually deserve two functions, even if they are usually called together (in that case we can make a 3rd function calling those two).

Few examples of breaking this rule:

- `getAge` -- would be bad if it shows an `alert` with the age (should only get).
- `createForm` -- would be bad if it modifies the document, adding a form to it (should only create it and return).
- `checkPermission` -- would be bad if displays the `access granted/denied` message (should only perform the check and return the result).

These examples reflect few common meanings of prefixes, the final word comes from you and your team. Maybe it's pretty normal for your code to behave differently. But you should to have a firm understanding what a prefix means, what a prefixed function can and what it can not do. All same-prefixed functions should obey the rules. And the team should share the knowledge.
```

```smart header="Ultrashort function names"
Functions that are used *very often* sometimes have ultrashort names.

For example, [jQuery](http://jquery.com) framework defines a function `$`, [LoDash](http://lodash.com/) library has it's core function named `_`.

These are exceptions. Generally functions names should be concise, but descriptive.
```

## Summary

Functions are the main building blocks of scripts. They pack together a bunch of commands.

A function declaration looks like this:

```js
function name(parameters, delimited, by, comma) {
 /* ...code... */
}
```

Let's briefly summarize their main features.

**Local variables**

- Values passed to function as parameters are copied to its local variables and are accessible in `code`.
- A function may declare its own local variables e.g. using `let`.
- A function may access outer variables. But it works only one-way: the code outside of the function doesn't see its local variables.

As a general advice, it's recommended for a function to use local variables and parameters as much as possible instead of referencing outer variables directly.

**Parameters**

- Default values can be set after `=`.
- The rest and spread operators can be used to convert a list of parameters into an array and vise versa.

**Returning a value**

- In Javascript, a function always returns a value.
- If it doesn't, then the result is `undefined`.

**Function naming**

- A name should clearly describe what the function does. When we see a function call in the code, a good name instantly gives us an understanding what it does and returns.
- A function is an action, so function names are usually verbal.
- There is a bunch of commonly adapted verbal prefixes like `create…`, `show…`, `get…`, `check…` etc which can help. The main point is to be consistent about their meaning.

Now we covered the basics, so we actually can start creating and using functions. But that's only the beginning of the path. We are going to return to functions many times, delving more deeply in their advanced features.
