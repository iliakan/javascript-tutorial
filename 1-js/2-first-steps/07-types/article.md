# Data types

A variable in JavaScript can contain any data. A variable can at one moment be a string and later recieve a numeric value:

```js
// no error
let message = "hello";
message = 123456;
```

Such languages are called "dynamically typed", meaning that there are language types, but variables are not bound to any of them. 

There are 7 basic data types in JavaScript. Here we'll study the basics of them, and in the next chapters we'll talk about each of them in detail.

[cut]

## A number

```js
let n = 123;
n = 12.345;
```

A *number* type serves both for integer and floating point numbers.

There are many operations for numbers, e.g. multiplication `*`, division `/`, addition `+`, substraction `-` and so on.

Besides regular numbers there are so-called "special numeric values" which also belong to that type: `Infinity`, `-Infinity` and `NaN`.

- `Infinity` represents the mathematical [Infinity](https://en.wikipedia.org/wiki/Infinity) ∞. It is a value that's greater than any number.

    We can get it as a result of division by zero:

    ```js run
    alert( 1 / 0 ); // Infinity
    ```

    Or just mention it in the code directly:

    ```js run
    alert( Infinity ); // Infinity
    ```
- `NaN` represents a computational error. It is a result of an incorrect or an undefined mathematical operation, for instance:

    ```js run
    alert( "not a number" / 2 ); // NaN
    ```

    `NaN` is "sticky". Any further operation on `NaN` would give `NaN`:

    ```js run
    alert( "not a number" / 2 + 5 ); // NaN
    ```

    So, if there's `NaN` somewhere in a mathematical expression, it propagates to the whole result.

```smart header="Mathematical operations are safe"
Doing maths is safe in JavaScript. We can do anything: divide by zero, treat non-numeric strings as numbers, etc.

The script will never stop ("die") on that. At worst we'll get `NaN` as the result.
```

Special numeric values formally belong to the "number" type. Of course they are not numbers in a common sense of this word.

We'll see more into working with numbers in the chapter <info:number>.

## A string

```js
let str = "Hello";
let str2 = 'Single quotes are ok too';
let phrase = `can embed ${str}`;
```

In JavaScript, there are 3 types of quotes.

1. Double quotes: `"Hello"`.
2. Single quotes: `'Hello'`.
3. Backticks: <code>&#96;Hello&#96;</code>.

Double and single quotes are similar, "simple" quotes.

Backticks are "extended functionality" quotes. They allow to embed variables and expressions into a string by wrapping them in `${…}`, for example:

```js run
let name = "John";

// embed variable
alert( `Hello, ${name}!` ); // Hello, John!

// embed expression
alert( `the result is ${1 + 2}` ); // the result is 3
```

The expression inside `${…}` is evaluated and the result becomes a part of the string. We can put anything there: a variable like `name` or an arithmetical expression like `1 + 2` or something more complex.

We'll cover strings more thoroughly in the chapter <info:string>.

```smart header="There is no *character* type."
In some languages, there is a special "character" type for a single character. For example, in the C language it is `char`.

In JavaScript, there is no such type. There's only one type: `string`. A string may consist of only one character or many of them.
```

## A boolean (logical)

The boolean type has only two values: `true` and `false`.

This type is commonly used to store yes/no values: `true` means "yes, correct", and `false` means the "no, incorrect".

For instance:

```js
let checked1 = true;  // yes, the form field is checked
let checked2 = false; // no, the form field is not checked
```

Boolean values also come as the result of comparisons:

```js run
let isGreater = 4 > 1;

alert( isGreater ); // true (the comparison result is "yes")
```

We'll cover booleans more deeply later while discussing [logical operators](/logical-ops).

## The "null" value

The special `null` value does not belong to any type described above.

It forms a separate type of its own, which contains only the `null` value:

```js
let age = null;
```

In JavaScript `null` is not a "reference to a non-existing object" or a "null pointer" like in some other languages.

It's just a special value which has the sense of "nothing", "empty" or "value unknown".

The code above states that the `age` is unknown or empty for some reason.

## The "undefined" value

The special value `undefined` stands apart. It makes a type of its own, just like `null`.

The sense of `undefined` is "value is not assigned".

If a variable is declared, but not assigned, then its value is exactly `undefined`:

```js run
let x;

alert( x ); // shows "undefined"
```

Technically, it is possible to assign to `undefined`:

```js run
let x = 123;

x = undefined;

alert( x ); // "undefined"
```

...But it's not recommended to do that. Normally, we use `null` to write an "empty" or an "unknown" value into the variable, and `undefined` is only used for checks, to see if the variable is assigned or similar.


## Objects

The `object` type is special.

All other types are called "primitive", because their values can contain only a single thing (be it a string or a number or whatever).

In contrast, objects are used to store *keyed collections* of various data and more complex entities. In programming that's sometimes called an "associative array" or a "hash".

An object is defined with the figure brackets `{…}` with an optional list of *properties*. A property is a "key: value" pair, where `key` is a string (also called a "property name"), and `value` can be anything.

For instance, here we create an object `user` with two properties:

```js
let user = {     
  name: "John",  // key "name", value "John"
  age: 30        // key "age", value 30
};
```

The `user` object can be imagined as a cabinet with two signed files labelled "name" and "age", each containing the corresponding value.

![user object](object-user.png)

Both values are accessible using the "dot" notation:

```js
// get properties of the object:
alert( user.name ); // John
alert( user.age ); // 30
```

Also we can add new information to the user any time later:

```js
user.isAdmin = true;
```

![user object 2](object-user-isadmin.png)

...Or remove the `age` property with the help of `delete` operator:

```js
delete user.age;
```

![user object 3](object-user-delete.png)

Technically, we can name the property using any string, like `"hello world"`, or even a sentence like `"likes to swim?"`. And sometimes that's handy.

But to work with complex keys, there's another way to access them, because the dot notation stops working:

```js run
user.likes to swim? = true; // syntax error!
```

That's because the dot only supports keys that are valid variable identifiers (no spaces and other limitations).

There's a more powerful "square bracket notation" that works with any string:

```js run
let user = {};

// set
user["likes to swim?"] = true;

// get
alert(user["likes to swim?"]); // true

// delete
delete user["likes to swim?"];
```

Now everything is fine. Please note that the string is properly quoted (any type of quotes will do).

Square brackets are also provide a way to access a property by the name from the variable:

```js
let key = "likes to swim?";

// same as user["likes to swim?"] = true;
user[key] = true; 
```

Here, the variable `key` is may be evaluated or calculated at run-time. And then we use it to access the property. That gives us a great deal of flexibility. The dot notation cannot be used in similar way.

So, most of time, the dot notation is used to access known and simple object properties, but when we need something more complex, then we use square brackets.

### More advanced objects

The objects that we've just seen are called "plain objects", or just `Object`.

They serve as a basis for many other, more specialized kinds of objects:

- `Array` objects to store ordered data collections,
- `Date` objects to store the information about the date and time,
- `Error` objects to store the information about an error.
- ...And so on.

These more advanced objects do not have types of their own, but belong to a single "object" data type. And they extend it in various ways. Of course we'll see how they do it.

Objects in JavaScript are very powerful. Here we've just started to get the basics of the topic that is really huge. Now we can create plain objects and add/remove properties from them. But we'll be consistently returning to objects and learn much more about them in further parts of the tutorial.

## Arrays

As we’ve just seen, objects in Javascript store arbitrary keyed values.

But quite often we find that we need an *ordered collection*, where we have a 1st, a 2nd, a 3rd element and so on.

For example, we need that to store a list of something: users, goods, HTML elements etc. Plain objects do not provide ways to set the order of elements. We can't directly access the n-th property of an object by its number. Also we can’t insert a new property "between" the existing ones. Objects are just not meant for such use.

There exists a special data structure named "an array", to store ordered collections.

An array is created using square brackets with an optional list of elements:

```js
let empty = []; // empty array

let fruits = ["Apple", "Orange", "Plum"]; // array with 3 values
```

Individual items are accessed using brackets `[]`. The first item has zero index:

```js run
let fruits = ["Apple", "Orange", "Plum"]; // array with 3 values

alert( fruits[0] ); // Apple
alert( fruits[1] ); // Orange
alert( fruits[2] ); // Plum

// how many elements (last index + 1)
alert( fruits.length ); // 3
```

As we can see, arrays have `length` property that keeps the total number of elements. To be more precise, `length` always equals the last index plus one (thus 3 in the example above).

Arrays are based on objects, but they extend them with features of their own, allowing to add, remove, extract elements from the array, to sort them and more. We'll cover them in the chapter <info:array>.

## Symbol type

The `symbol` type is used in conjunction with objects. Probably we won't need symbols soon, but it's the 7th and the last basic type of the language, so we just must mention it here, even for the sake of completeness.

A "symbol" represents an unique identifier with a given name.

A value of this type can be created using `Symbol(name)`:

```js
// id is a symbol with the name "id"
let id = Symbol("id");
```

If you used Ruby language (or few others that have symbols too), then you may feel proficient about symbols already. But stay tuned. Symbols in JavaScript are different. Please don't get trapped by the same word.

`Symbol` is a special primitive type used for identifiers, which are guaranteed to be unique. So, even if we create many symbols with the same name, they are still unique, and not equal:

```js run
let id1 = Symbol("id");
let id2 = Symbol("id");

*!*
alert(id1 == id2); // false (!)
*/!*
```

Now, when do we need such identifiers?

The most popular use for symbols is to create "concealed" properties of an object, that no other part of code can occasionally access or overwrite.

Let's see an example. For instance, we have a `user` object. And we'd like to store an identifier in it, exclusively for the purposes of our library.

First let's use string keys, just to see the problem.

```js run
let user = { name: "John" };

// our script creates user.id
user.id = 123;
alert( user.id ); // 123
```

Now let's imagine that another script wants to work with that object, and it also would like to store an identifier in the object, for its own purposes. The script is written by *another person*, so the scripts are completely unaware for each other.

...But if it tries to make use of the same `"id"` key, then it would occasionally overwrite our id. That's the conflict.

```js
// user.id = 123;
// ...

// another script also wants to store something in user.id
user.id = 456;
alert( user.id ); // conflict!
```

So, when two scripts want to store something in the object, they must fight for the property name to use. If one of them already used `"id"`, then the other one must choose something else.

Here come symbols. They bring peace. Each script can create its own `Symbol("id")` and use it as the key.

For instance, in our code:

```js run
// our script
let user = { name: "John" };

let id = Symbol("id"); // use symbol as the key

user[id] = 123;
alert( user[id] ); // 123
```

...And in a third-party code, they can create their own `Symbol("id")`, and use it as the key. These two ids will never mix. There will be no conflict, because symbols are always different, even if they have the same name.

Also, symbols are widely used by the JavaScript language itself to store "system" properties, that we should not occasionally overwrite. We'll meet them in later chapters.

## The typeof operator [#type-typeof]

The `typeof` operator returns the type of the argument.  

It's useful when we want to process values of different types differently, or just want to make a quick check.

It supports two forms of syntax:

1. As an operator: `typeof x`.
2. Function style: `typeof(x)`.

In other words, it works both with the brackets or without them. The result is the same.

The call to `typeof x` returns a string, which has the type name:

```js
typeof undefined // "undefined"

typeof 0 // "number"

typeof true // "boolean"

typeof "foo" // "string"

typeof Symbol("id") // "symbol"

typeof {} // "object"

*!*
typeof [] // "object"  (1)
*/!*

*!*
typeof null // "object"  (2)
*/!*

*!*
typeof alert // "function"  (3)
*/!*
```

The last three lines may be a little unobvious so here's explanations:

1. The array is not a type of its own, it is based on object, that's why `typeof []` is `"object"`.
2. The result of `typeof null` equals to `"object"`. That's an officially recognized error in `typeof`, that originates from ancient times. Of course, `null` is not an object. It is a special value with a separate type of its own. So, again, that's an error in `typeof`, kept as it is for compatibility.
3. The result of `typeof alert` is `"function"`, because `alert` is a function of the language. We'll study functions in the near future and see that in fact functions belong to the object type. But `typeof` treats them differently. That's very convenient in practice.



## Summary

There are 7 basic types in JavaScript.

- `number` for numbers of any kind, can convert into it using `Number(value)`.
- `string` for strings and characters, can convert into it using `String(value)`.
- `boolean` for `true`/`false`, can convert into it using `Boolean(value)`.
- `null` for unknown values.
- `undefined` for unassigned values.
- `symbol` for unique identifiers.
- `object` for more complex data structures.

The `typeof` operator allows to see which type is stored in the variable.
