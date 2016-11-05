# Destructuring

Variables can be easily made properties of an object. We know there's a property-value shorthand for that:

```js
let var1 = "value1";
let var2 = "value2";

let obj = {
  var1, // obj.var1 gets value from variable var1
  var2  // obj.var2 gets value from variable var2
};
```

But quite often we need the reverse. We have the data passed as an object and would like to extract some values from it into variables, to work with them more conveniently.

Destructuring assignment does exactly that. Soon we'll see how really great it works for complex functions.

The basic syntax looks like this:

```js
let {var1, var2} = {var1:…, var2…}
```

We should have an existing object at the right side. Variables on the left side read properties from it.

The example is self-descriptive:

```js run
let options = {
  title: "Menu",
  width: 100,
  height: 200
};

*!*
let {title, width, height} = options;
*/!*

alert(title);  // Menu
alert(width);  // 100
alert(height); // 200
```

Properties `title`, `width` and `height` are automcatically assigned to the corresponding variables. Now it might be a little bit more convenient to work with them.

The order of properties does not matter, that works too:

```js
// works the same as let {title, width, height} = ...
let {height, width, title} = { title: "Menu", height: 200, width: 100 }
```


````smart header="\"Destructuring\" does not mean \"destructive\""
That's called "destructuring assignment", because it "destructurizes" the object by copying properties into variables. But the object itself is not modified.

That's just a shorter way to write:
```js
let title = options.title;
let height = options.height;
let width = options.width;
```
````

If we want to assign a property to a variable with another name, for instance, `options.width` to go into the variable named `w`, then we can set the mapping using a colon:

```js run
let options = {
  title: "Menu",
  width: 100,
  height: 200
};

*!*
// mapping { property: variable }
let {width: w, height: h, title} = options;
*/!*

alert(title);  // Menu
alert(w);      // 100
alert(h);      // 200
```

The colon shows "what : goes where". In the example above the property `width` goes to `w`, property `height` goes to `h`, and `title` is assigned to the same name.

If some properties are absent, we can set default values using `=`:

```js run
let options = {
  title: "Menu"
};

*!*
let {width=100, height=200, title} = options;
*/!*

alert(title);  // Menu
alert(width);  // 100
alert(height); // 200
```

Note that default values can be any expressions or even function calls. They will be evaluated if the value is not provided.

The code below asks for width, but not about the title.

```js run
let options = {
  title: "Menu"
};

*!*
let {width=prompt("width?"), title=prompt("title?")} = options;
*/!*

alert(title);  // Menu
alert(width);  // (whatever you the result of prompt is)
```



We also can combine both colon `:` and `=`:

```js run
let options = {
  title: "Menu"
};

*!*
let {width:w=100, height:h=200, title} = options;
*/!*

alert(title);  // Menu
alert(w);      // 100
alert(h);      // 200
```

Here, property `width` goes to variable `w`, which becomes `100` if no such property exists, and the similar happens with `height`.

### The rest operator

What if the object has more properties than we have variables? Can we take some and then assign the "rest" somewhere?

The specification for using the rest operator (three dots) here is almost in the standard, but most browsers do not support it yet.

It looks like this:

```js run
let options = {
  title: "Menu",
  height: 200,
  width: 100
};

*!*
let {title, ...rest} = options;
*/!*

// now title="Menu", rest={height: 200, widht: 100}
alert(rest.height);  // 200
alert(rest.width);   // 100
```



````smart header="Gotcha without `let`"
In the examples above variables were declared right before the assignment: `let {…} = {…}`. Of course, we could use the existing variables too. But there's a catch.

This won't work:
```js run
let title, width, height;

// error in this line
{title, width, height} = {title: "Menu", width: 200, height: 100};
```

The problem is that Javascript treats `{...}` in the main code flow (not inside another expression) as a code block. Such code blocks can be used to group statements, like this:

```js run
{
  // a code block
  let message = "Hello";
  // ...
  alert( message );
}
```

To show Javascript that it's not a code block, we can wrap the whole assignment in brackets `(...)`:

```js run
let title, width, height;

// okay now
*!*(*/!*{title, width, height} = {title: "Menu", width: 200, height: 100}*!*)*/!*;

alert( title ); // Menu
```

````

## Array destructuring

Now as we are here, let's note that destructuring also works with arrays. The syntax is similar:

```js
let [var1, var2] = arr;
```

For instance, we have an array with the name and surname. And we'd like to put them into variables for better convenience.

Here's how it's done:

```js run
let names = ["Ilya", "Kantor"]

*!*
// destructuring assignment (*)
let [firstName, surname] = names;
*/!*

alert(firstName); // Ilya
alert(surname);  // Kantor
```

The assignment `(*)` puts the first value of the array into `firstName` and the second one into `surname`. Any other array elements (if exist) are ignored.

````smart header="We can ignore first elements"
Unwanted elements of the array can also be thrown away with an extra comma, like this:

```js run
*!*
// first and second elements are not needed
let [, , title] = ["Julius", "Caesar", "Consul", "of the Roman Republic"];
*/!*

alert( title ); // Consul
```

In the code above, the first and second elements of the array are skipped, the third one is assigned to `title`, and the rest is also skipped.
````

### The rest for arrays

If we want to get all following values of the array, but are not sure of their number -- we can add one more parameter that gets "the rest" using the rest operator `"..."` (three dots):

```js run
*!*
let [name1, name2, ...rest] = ["Julius", "Caesar", "Consul", "of the Roman Republic"];
*/!*

alert(name1); // Julius
alert(name2); // Caesar

// ...and the rest as an array
alert(rest[0]); // Consul
alert(rest[1]); // of the Roman Republic
```

The value of `rest` is the array of the remaining array elements. We can use any other variable name in place of `rest`, like `...etc`. The operator is three dots. The rest operator must be the last.


### The default values

If there are less values in the array than variables in the assignment -- there will be no error, absent values are considered undefined:

```js run
*!*
let [firstName, surname] = [];
*/!*

alert(firstName); // undefined
```

If we want a "default" value to take place of the absent one, we can provide it using `=`:

```js run
*!*
// default values
let [name="Guest", surname="Anonymous"] = [];
*/!*

alert(name); // Guest
alert(surname);  // Anonymous
```

### Nested destructuring

Objects may be complex. And to extract the needed information, we may need to go deeper into an object. That's easily possible with nested destructuring.  

In the code below `options` is a complex object. It has another object in the property `size` and an array in the property `items`.

The destructuring assignment "unpacks" everything into variables:

```js run
let options = {
  size: {
    width: 100,
    height: 200
  },
  items: ["Cake", "Donut"]
}

// destructuring assignment is on multiple lines for clarity
// see how it maps the object structure into variables?
let {
  size: { // nested destructuring for size
    width,
    height
  },
  items: [item1, item2], // destruct items array into variables
  title = "Menu" // there's no title => default value will be used
} = options;

alert(title);  // Menu
alert(width);  // 100
alert(height); // 200
alert(item1);  // Cake
alert(item2);  // Donut
```

As we can see, the whole `options` object is correctly assigned to variables. Of course we could only get a few members, like:

```js
let { title, items } = options; // get only title and items array into variables
```

The left part of the destructuring assignment can use as many levels as needed.

## Destructuring parameters

Destructuring really comes in handy when a function can have many parameters, most of which are optional. That's especially true for user interfaces.

Imagine a function that creates a menu. It may have a width, a height, a title, items list and so on.

Here's a bad way to write such function:

```js
function showMenu(title = "Untitled", width = 200, height = 100, items = []) {
  // ...
}
```

Now the problem is how to remember the order of arguments. Code editors try to help us, especially if the code is well-documented, but still... Another problem is how to call a function when most parameters are default.

Like this?

```js
showMenu("My Menu", undefined, undefined, ["Item1", "Item2"])
```

That's ugly. And becomes unreadable when we deal with more parameters.

Destructuring to the rescue!

We can pass parameters as an object, and the function will "destruct" it immediately into variables.


The syntax is the same as for a destructuring assignment:
```js
function({ incomingProperty: parameterName = defaultValue ... }) { ... }
```

In our example:

```js run
let options = {
  title: "My menu",
  items: ["Item1", "Item2"]
};

*!*
function showMenu({title = "Untitled", width = 200, height = 100, items = []}) {
*/!*
  alert( title + ' ' + width + ' ' + height ); // My Menu 100 200
  alert( items ); // Item1, Item2
}

showMenu(options);
```

We can also use more complex destructuring with nestings and colon mappings:

```js run
let options = {
  title: "My menu",
  items: ["Item1", "Item2"]
};

*!*
function showMenu({
  title = "Untitled",
  width:w = 100,  // width goes to w
  height:h = 200, // height goes to h
  items: [item1, item2] // items first element goes to item1, second to item2
}) {
*/!*
  alert( title + ' ' + w + ' ' + h ); // My Menu 100 200
  alert( item1 ); // Item1
  alert( item2 ); // Item2
}

showMenu(options);
```

````smart header="Making everything optional"

Please note that the examples above assume that `showMenu()` does have an argument. If we want all values by default, then we should specify an empty object:

```js
showMenu({});

// that would give an error, because there's no object to destruct
showMenu();
```

We can fix this by making `{}` a value by default for the whole destructuring thing:


```js run
// simplified parameters a bit for clarity
function showMenu({ title="Menu", width=100, height=200 } *!*= {}*/!*) {
  alert( title + ' ' + width + ' ' + height );
}

showMenu(); // Menu 100 200
```

In the code above, the whole arguments object is `{}` by default, so there's always something to destructurize.
````

## Summary

- Destructuring assignment allows to instantly map an object or array into many variables.
- The object syntax:
    ```js
    let {prop : varName = default, ...} = object
    ```

    This means that property `prop` should go into the variable `varName` and, if no such property exists, then `default` value should be used.

- The array syntax:

    ```js
    let [item1 = default, item2, ...rest] = array
    ```

    The first item goes to `item1`, the second goes into `item2`, all the rest makes the array `rest`.

- For more complex cases, the left side must have the same structure as the right one.
