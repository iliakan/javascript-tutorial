# Comments

Comments are generally a good thing. But novices in programming generally get that wrong. They write comments explaining "what is going on in the code".

But the amount of such "explanatory" comments should be minimal.

Seriously, a good code should be easy to understand without them.

There's a great rule about that: "if the code is so unclear that it requires a comment, then maybe it should be rewritten instead".

[cut]

Sometimes it's beneficial to replace a code piece with a function, like here:

```js
function showPrimes(n) {
  nextPrime:
  for (let i = 2; i < n; i++) {

*!*
    // check if i is a prime number
    for (let j = 2; j < i; j++) {
      if (i % j == 0) continue nextPrime;
    }
*/!*

    alert(i);
  }
}
```

The better variant:


```js
function showPrimes(n) {

  for (let i = 2; i < n; i++) {
    *!*if (!isPrime(i)) continue;*/!*

    alert(i);  
  }
}

function isPrime(n) {
  for (let i = 2; i < n; i++) {
    if ( n % i == 0) return false;
  }
  return true;
}
```

Now we can understand the code easily without the comment. Such code is called *self-descriptive*.

And if we have a long "code sheet" like this:

```js
// here we add whiskey
for(let i = 0; i < 10; i++) {
  let drop = getWhiskey();
  smell(drop);
  add(drop, glass);
}

// here we add juice
for(let t = 0; t < 3; t++) {
  let tomato = getTomato();
  examine(tomato);
  let juice = press(tomato);
  add(juice, glass);
}

// ...
```

Then it might be a better variant to refactor it into functions like:

```js
addWhiskey(glass);
addJuice(glass);

function addWhiskey(container) {
  for(let i = 0; i < 10; i++) {
    let drop = getWhiskey();
    //...
  }
}

function addJuice(container) {
  for(let t = 0; t < 3; t++) {
    let tomato = getTomato();
    //...
  }
}
```

That's readable without comments. And also the code structure is better when split. It's clear what every function does, what it takes and what it returns.

In reality, we can't totally evade "explanatory" comments. There are complex algorithms. And there are smart "tweaks" for purposes of optimization. But generally we should try to keep the code simple and self-descriptive.

## Good comments

Which comments are good?

Describe the architecture
: Provide a high-level overview of components, how they interact, what's the control flow in various situations... In short -- the bird's eye view of the code. There's a special diagram language [UML](http://wikipedia.org/wiki/Unified_Modeling_Language) for high-level architecture diagrams. Definitely worth studying.

Document a function usage
: There's a special syntax [JSDoc](http://en.wikipedia.org/wiki/JSDoc) to document a function: usage, parameters, returned value.

    For instance:
    ```js
    /**
     * Returns x raised to the n-th power.
     *
     * @param {number} x The number to raise.
     * @param {number} n The power, must be a natural number.
     * @return {number} x raised to the n-th power.
     */
    function pow(x, n) {
      ...
    }
    ```

    Such comments allow to understand the purpose of the function and use it the right way without looking in its code.

    By the way, many editors like [WebStorm](https://www.jetbrains.com/webstorm/) can understand them as well and use them to provide autocomplete and some automatic code-checking.

    Also, there are tools like [JSDoc 3](https://github.com/jsdoc3/jsdoc) that can generate HTML-documentation from the comments. You can read more information about JSDoc at <http://usejsdoc.org/>.

Why the task is solved this way?
: What's written is important. But what's *not* written maybe even more important to understand what's going on. Why the task is solved exactly this way? The code gives no answer.

    If there are many ways to solve the task, why this one? Especially when it's not the most obvious one.

    Without such comments the following situation is possible:
    1. You (or your colleague) open the code written some time ago, and see that it's "suboptimal".
    2. You think: "How stupid I was then, and how much smarter I'm now", and rewrite using the "more obvious and correct" variant.
    3. ...The urge to rewrite was good. But in the process you see that the "more obvious" solution is actually lacking. You even dimly remember why, because you already tried it long ago. You revert to the correct variant, but the time was wasted.

    Comments that explain the solution are very important. They help to continue development the right way.

Any subtle features of the code? Where they are used?
: If the code has anything subtle and counter-obvious, it's definitely worth commenting.

## Summary

One of the signs of a good developer is his comments. Good comments allow to maintain the code well, return to it after a long delay and use features more effectively.

Comments are also used for auto-documenting tools: they read them and generate HTML-docs (or in another format).
