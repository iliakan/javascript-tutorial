# Objects in detail

Objects in JavaScript combine two functionalities.

1. First -- they are "associative arrays": a structure for storing keyed data.
2. Second -- they provide advanced features for object-oriented programming, like inheritance.

Here we concentrate on the first part. And after we're done we'll move into the second.

[cut]

## Object literals

Let's recall what we know about objects from the chapter [](/types) and add to it.

Objects are data structures for keyed values.

We can imagine it as a cabinet with signed files. Every piece of data is named:

![](object.png)

An empty object ("empty cabinet") can be created using one of two syntaxes:

```js
let user = new Object(); // "object constructor" syntax
let user = {};  // "object literal" syntax
```

![](object-user-empty.png)

Usually, the figure brackets `{...}` are used, they are more powerful shorter. The declaration is called an *object literal*.

We can set properties immediately:

```js
let user = {
  name: "John",
  age: 30,
  "likes birds": true  // multiword property name must be quoted
};
```

![](object-user-props.png)

````smart header="Trailing comma"
The last property may end with a comma:
```js
let user = {
  name: "John",
  age: 30*!*,*/!*
}
```
That is called a "trailing" or "hanging" comma. Makes it easier to add/move/remove properties, because all lines become alike.
````

...Or we can add/remove them later.


## Property-value shorthand

In real code we quite often want to construct an object from existing variables.

For instance:

```js run
function makeUser() {
  let name = prompt("Name?");
  let age = prompt("Age?");
  return {
    name: name,
    age: age
  };
}

let user = makeUser("John", 30);
alert(user.name); // John
```

The use-case of making a property from a variable is so common, that there's a special *property value shorthand* to make it shorter.

Instead of `name: name` we can just write `name`, like here:

```js
function makeUser(name, age) {
  return {
    name,
    age
  }
}
```

We can also combine normal properties and shorthands:

```js
let user = {
  name,  // same as name:name
  age: 30
};
```


## Accessing a property

To access a property, there are two syntaxes:

- The dot notation: `user.name`
- Square brackets: `user["name"]`

The dot notation requires the name to be a valid variable identifier, that implies: no spaces, no special characters and other limitations. Square brackets are more powerful, because they allow to specify an arbitrary string as a property name. Also, square brackets is the only choice when the name of the property is in a variable.

For instance:

```js run
let user = {
  name: "John",
  age: 30
};

let key = prompt("What do you want to know about the user?", "name");

// access by variable
alert( user[key] ); // John (if enter "name")
```

The square brackets in `user[key]` mean: "take the property which name is in `key` variable".

Square brackets also can be used in an object literal.

That's called a *computed property*:

```js run
let fruit = prompt("Which fruit to buy?", "apple");

let bag = {
  [fruit]: 5, // the name of the property is taken from the variable fruit
};

alert( bag.apple ); // 5 if fruit="apple"
```

Here, the object `bag` is created with a property with the name from `fruit` variable and the value `5`.

Essentially, that works the same as:
```js
let bag = {};
bag[fruit] = 5;
```

We could have used a more complex expression inside square brackets or a quoted string. Anything that would return a property name:

```js
let fruit = 'apple';
let bag = {
  [ fruit.toUpperCase() ]: 5 // bag.APPLE = 5
};
```


````smart header="Property name must be either a string or a symbol"
We can only use strings or symbols as property names.

Other values are converted to strings, for instance:

```js run
let obj = {
  0: "test" // same as "0": "test"
}

// bot alerts access the same property (the number 0 is converted to string "0")
alert( obj["0"] ); // test
alert( obj[0] ); // test (same property)
```
````


````smart header="Reserved words are allowed as property names"
A variable cannot have a name equal to one of language-reserved words like "for", "let", "return" etc.

But for an object property, there's no such restruction. Any name is fine:

```js run
let obj = {
  for: 1,
  let: 2,
  return: 3
}

alert( obj.for + obj.let + obj.return );  // 6
```

Basically, any name is allowed, with one exclusion: `__proto__`.

The built-in property named `__proto__` has a special functionality (we'll cover it later), and it can't be set to a non-object value:

```js run
let obj = {};
obj.__proto__ = 5;
alert(obj.__proto__); // [object Object], didn't work as intended
```

As we see from the code, the assignment to a primitive `5` is ignored. If we want to store *arbitrary* (user-provided) keys, then such behavior can be the source of bugs and even vulnerabilities, because it's unexpected. There's another data structure [Map](info:map-set-weakmap-weakset), that we'll learn in the chapter <info:map-set-weakmap-weakset>, which supports arbitrary keys.
````

## Removing a property

There's a `delete` operator for that:

```js
delete user.name;
```

## Check if a property exists

A notable objects feature is that it's possible to access any property. There will be no error if the property doesn't exist! Accessing a non-existing property just returns `undefined`. It provides a very common way to test whether the property exists -- to get it and compare vs undefined:

```js run
let user = {};

alert( user.noSuchProperty === undefined ); // true means "no such property"
```

There also exists a special operator `"in"` to check for the existance of a property.

The syntax is:
```js
"key" in object
```

For instance:

```js run
let user = { name: "John", age: 30 };

alert( "age" in user ); // true, user.age exists
alert( "blabla" in user ); // false, user.blabla doesn't exist
```

Please note that at the left side of `in` there must be a *property name*. That's usually a quoted string.

If we omit quotes, that would mean a variable containing the actual name to be tested. For instance:

```js run
let user = { age: 30 };

let key = "age";
alert( key in user ); // true, takes the value of key and checks for such property
```

````smart header="Using \"in\" for properties that store `undefined`"
There is a case when `"=== undefined"` check fails, but the `"in"` operator works correctly.

It's when an object property stores `undefined`:

```js run
let obj = {
  test: undefined
};

alert( obj.test ); // undefined, no such property?

alert( "test" in obj ); // true, the property does exist!
```


In the code above, the property `obj.test` technically exists. So the `in` operator works right.

Situations like this happen very rarely, because `undefined` is usually not assigned. We mostly use `null` for "unknown" or "empty" values. So the `in` operator is an exotic guest in the code.
````

## Looping over properties

To iterate over properties we can use `for..in` loop as described in the chapter [](info:while-for#for..in).

For instance:

```js run
let user = {
  name: "John",
  age: 30,
  isAdmin: true
};

// iterate over keys
for(let key in user) {
  alert(`${key}:${user[key]}`); // name:John, then age:30, then isAdmin:true
}
```

## Copying by reference

One of fundamental differences of objects versus primitives is that they are stored and copied "by reference".

Primitive values: strings, numbers, booleans -- are assigned/copied "as a whole value".

For instance:

```js
let message = "Hello!";
let phrase = message;
```

As a result we have two independant variables, each one is storing the string `"Hello!"`.

![](variable-copy-value.png)

Objects are not like that.

**A variable stores not the object itself, but it's "address in memory", in other words "a reference" to it.**

Here's the picture for the object:

```js
let user = {
  name: "John"
};
```

![](variable-contains-reference.png)

Note that the object itself is stored somewhere in memory. The variable `user` has a "reference" to it.

**When an object variable is copied -- the reference is copied, the object is still single.**

We can easily grasp it if imagine an object as a cabinet, and a variable is a key to it. We can copy that key to another variable, the cabinet is still single.

For instance:

```js no-beautify
let user = { name: "John" };

let admin = user; // copy the reference
```

Now we have two variables, each one with the reference to the same object:

![](variable-copy-reference.png)

Compare it with the primitives' picture. There's only one object, it's not copied.

Now can use any variable to access the cabinet and modify its contents:

```js run
let user = { name: 'John' };

let admin = user;

*!*
admin.name = 'Pete'; // changed by the "admin" reference
*/!*

alert(*!*user.name*/!*); // 'Pete', changes are seen from the "user" reference
```

Quite obvious, if we used one of the keys (`admin`) and changed something inside the cabinet, then if we use another key later (`user`), we find things modified.

## Comparison by reference

Two object variabls are equal only when reference the same object:

```js run
let a = {};
let b = a; // copy the reference

alert( a == b ); // true, both variables reference the same object
```

We can also think of it like: the variables are "papers with address" of the objects. We copied the address from `a` to `b`. Then when we compare `a == b`, we compare the adresses. If they match, the equality is truthy.

In all other cases objects are non-equal, even if their content is the same.

For instance:

```js run
let a = {};
let b = {}; // two independents object

alert( a == b ); // false
```

For unusual equality checks like: object vs a primitive (`obj == 5`), or an object less/greater than another object (`obj1 > obj2`), objects are converted to numbers. To say the truth, such comparisons occur very rarely in real code and usually are a result of a coding mistake.

## Cloning and Object.assign

What if we need to duplicate an object? Create an independant copy, a clone?

That's also doable, but a little bit more difficult, because there's no such method in Javascript. Actually, copying by reference is good most of the time.

But if we really want that, then we need to create a new object and replicate the structure of the existing one by iterating over its properties and copying them on the primitive level.

Like this:

```js run
let user = {
  name: "John",
  age: 30
};

*!*
let clone = {}; // the new empty object

// let's copy all user properties into it
for (let key in user) {
  clone[key] = user[key];
}
*/!*

// now clone is a fully independant clone
clone.name = "Pete"; // changed the data in it

alert( user.name ); // still John
```

Also we can use the built-in function [Object.assign](mdn:js/Object/assign) for that.

The syntax is:

```js
Object.assign(dest[, src1, src2, src3...])
```

- `dest`, and other arguments `srcN` (can be as many as needed) are objects
- It copies the properties of all objects `src1`, `src2` into `dest`. In other words, properties of all arguments starting from the 2nd are copied into the 1st. Then it returns `dest`.

For instance:
```js
let user = { name: "John" };

let permissions1 = { canView: true };
let permissions2 = { canEdit: true };

// copies all properties from permissions1 and permissions2 into user
Object.assign(user, permissions1, permissions2);

// now user = { name: "John", canView: true, canEdit: true }
```

If `dest` already has the property with the same name, it will be overwritten:

```js
let user = { name: "John" };

// overwrites user.name
Object.assign(user, { name: "Pete", isAdmin: true });

// now user = { name: "Pete", isAdmin: true }
```


Here we can use it to replace the loop for cloning:

```js
let user = {
  name: "John",
  age: 30
};

*!*
let clone = Object.assign({}, user);
*/!*
```

It copies all properties of `user` into the empty object and returns it. Actually, the same as the loop, but shorter.

Up to now we assumed that all properties of `user` are primitive. But actually properties can be references to other objects. What to do with them?

Like this:
```js run
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};

alert( user.sizes.height ); // 182
```

Now it's not enough to copy `clone.sizes = user.sizes`, because the `user.sizes` will be copied by reference. So `clone` and `user` will share the same object as `sizes`.

To fix that, we can examine the value of each `user[key]` in the cloning loop and if it's an object, then replicate it's structure as well. That is called a "deep cloning".

There's a standard algorithm for deep cloning that handles the case above and more complex cases, called the [Structured cloning algorithm](w3c.github.io/html/infrastructure.html#internal-structured-cloning-algorithm). There exist many implementations, one of the best is in the Javascript library [lodash](https://lodash.com). The method is called [_.cloneDeep(obj)](https://lodash.com/docs#cloneDeep).
