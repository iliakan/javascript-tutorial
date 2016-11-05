
# Advanced loops over objects

We've already seen one of the loops: `for..in`

```js
for(let key in obj) {
  // key iterates over object keys
}
```

But other ways of looping may be more convenient.

[cut]

## Methods

Helpful methods are:

- [Object.keys(obj)](mdn:js/Object/keys) -- returns the array of keys.
- [Object.values(obj)](mdn:js/Object/values) -- returns the array of values.
- [Object.entries(obj)](mdn:js/Object/entries) -- returns the array of `[key, value]` pairs.

For an object:

```js
let user = {
  name: "John",
  age: 30
};
```

These methods return:

- `Object.keys(user) = [name, age]`
- `Object.values(user) = ["John", 30]`
- `Object.entries(user) = [ ["name","John"], ["age",30] ]`

## Loops

Naturally, we can use `Object.values` with `for..of` to iterate over object values:

```js run
let user = {
  name: "John",
  age: 30
};

for(let value of Object.values(user)) {
  // iterates over values
  alert(value); // John, then 30
}
```

Here `Object.values(user)` returns the array of properties, and `for..of` iterates over the array.

Also we can combine destructuring with `Object.entries` to iterate over key/value pairs:

```js run
let user = {
  name: "John",
  age: 30
};

for(let [key, value] of Object.entries(obj)) {
  // key,value iterate over properties
  alert(`${key}:${value}`); // name:John, then age:30
}
```

Looks useful if we need not only keys, but values as well, right?

The example of all 3 loops:

```js run
let user = {
  name: "John",
  age: 30
};

// over keys
for(let key in user) {
  alert(key); // name, then age
  // can get the values with user[key]
}

// over values
for(let value of Object.values(user)) {
  alert(value); // John, then 30
}

// over key/value pairs
for(let [key, value] of Object.entries(user)) {
  alert(key + ':' + value); // name:John, then age:30
}
```


```smart header="These loops ignore symbolic properties"
All 3 forms of loops (and the given `Object` methods) ignore properties that use `Symbol(...)` as keys.

That's actually a wise thing, because symbols are created to make sure that the property can not be accessed accidentally. There is a separate method named [Object.getOwnPropertySymbols](mdn:js/Object/getOwnPropertySymbols) that returns an array of only symbolic keys (if we really know what we're doing and insist on that).
```


## Ordered like an object

Now let's touch one more topic, tightly related with loops.

Are objects ordered? In other words, if we loop over an object, do we get all properties in the same order that they are added in it? Can we rely on it?

The short answer is: "ordered in a special fashion": integer properties are sorted, others appear in creation order. The details follow.

As an example, let's consider an object with the phone codes:

```js run
let codes = {
  "49": "Germany",
  "41": "Switzerland",
  "44": "Great Britain",
  // ..,
  "1": "USA"
};

*!*
for(let code in codes) {
  alert(code); // 1, 41, 44, 49
}
*/!*
```

The object may be used to suggest a list of options to the user. If we're making a site mainly for German audience then we probably want `49` to be the first.

But if we run the code, we see a totally different picture:

- USA (1) goes first
- then Switzerland (41) and so on.

That's because the iteration order is:

1. Integer properties in the ascending sort order go first.
2. String properties in the orders of their creation.
3. Symbol properties in the order of their creation.

The phone codes were sorted, because they are integer. That's why we see `1, 41, 44, 49`.

````smart header="Integer properties? What's that?"
By specification object property names are either strings or symbols. So an "integer property" actually means a string that can be converted to-from integer without a change.

So, "49" is an integer string, because when it's transformed to an integer number and back, it's still the same. But "+49" and "1.2" are not:

```js run
alert( String(Math.trunc(Number("49"))) ); // "49", same, integer property
alert( String(Math.trunc(Number("+49"))) ); // "49", not same ⇒ not integer property
alert( String(Math.trunc(Number("1.2"))) ); // "1", not same ⇒ not integer property
```
````

On the other hand, if the keys are non-integer, then they are listed as they appear, for instance:

```js run
let user = {
  name: "John",
  surname: "Smith"
};
user.age = 25; // add one more

*!*
// non-integer properties are listed in the creation order
*/!*
for (let prop in user) {
  alert( prop ); // name, surname, age
}
```

So, to fix the issue with the phone codes, we can "cheat" by making the codes non-integer. Adding a plus `"+"` sign before each code is enough.

Like this:

```js run
let codes = {
  "+49": "Germany",
  "+41": "Switzerland",
  "+44": "Great Britain",
  // ..,
  "+1": "USA"
};

for(let code in codes) {
  alert( +code ); // 49, 41, 44, 1
}
```

Now it works as intended.



## Summary [todo]

Objects are associative arrays with several special features.

- Property keys are either strings or symbols.
- Values can be of any type.

Property access:

- Read/write uses the dot notation: `obj.property` or square brackets `obj["property"]/obj[varWithKey]`.
- The deletion is made via the `delete` operator.
- Existance check is made by the comparison vs `undefined` or via the `in` operator.
- Three forms of looping:
  - `for(key in obj)` for the keys.
  - `for(value of Object.values(obj))` for the values.
  - `for([key,value] of Object.entries(obj))` for both.

- Ordering:
  - Integer properties in sorted order first, then strings in creation order, then symbols in creation order.
  - To keep the order for numeric properties, we can prepend them with `+` to make them look like non-numeric.

- Objects are assigned and copied by reference.
