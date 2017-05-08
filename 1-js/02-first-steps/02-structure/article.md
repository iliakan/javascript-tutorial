# Code structure

The first thing to study is the building blocks of the code.

[cut]

## Statements

Statements are syntax constructs and commands that perform actions.

We've already seen a statement `alert('Hello, world!')`, which shows the message.

We can have as many statements in the code as we want. Another statement can be separated with a semicolon.

For example, here we split the message into two:

```js run no-beautify
alert('Hello'); alert('World');
```

Usually each statement is written on a separate line -- thus the code becomes more readable:

```js run no-beautify
alert('Hello');
alert('World');
```

## Semicolons [#semicolon]

A semicolon may be omitted in most cases when a line break exists.

This would also work:

```js run no-beautify
alert('Hello')
alert('World')
```

Here JavaScript interprets the line break as an "implicit" semicolon. That's also called an [automatic semicolon insertion](https://tc39.github.io/ecma262/#sec-automatic-semicolon-insertion).

**In most cases a newline implies a semicolon. But "in most cases" does not mean "always"!**

There are cases when a newline does not mean a semicolon, for example:

```js run no-beautify
alert(3 +
1
+ 2);
```

The code outputs `6`, because JavaScript does not insert semicolons here. It is intuitively obvious that if the line ends with a plus `"+"`, then it is an "incomplete expression", no semicolon required. And in this case that works as intended.

**But there are situations where JavaScript "fails" to assume a semicolon where it is really needed.**

Errors which occur in such cases are quite hard to find and fix.

````smart header="An example of an error"
If you're curious to see a concrete example of such an error, check this code out:

```js run
[1, 2].forEach(alert)
```

No need to think about the meaning of the brackets `[]` and `forEach` yet. We'll study them later, for now -- it does not matter. Let's just remember the result: it shows `1`, then `2`.

Now let's add an `alert` before the code. And *not* finish it with a semicolon:

```js run no-beautify
alert("There will be an error")

[1, 2].forEach(alert)
```

Now if we run it, only the first `alert` is shown, and then we have an error!

But everything is fine again if we add a semicolon after `alert`:
```js run
alert("All fine now");

[1, 2].forEach(alert)  
```

Now we have the "All fine now" message and then `1` and `2`.


The error in the no-semicolon variant occurs because JavaScript does not imply a semicolon before square brackets `[...]`.

So, because the semicolon is not auto-inserted, the code in the first example is treated as a single statement, that's how the engine sees it:

```js run no-beautify
alert("There will be an error")[1, 2].forEach(alert)
```

But it should be two separate statements, not a single one. Such a merging in this case is just wrong, hence the error. There are other situations when such thing happens.
````

It's recommended to put semicolons between statements even if they are separated by newlines. This rule is widely adopted by the community. Let's note once again -- *it is possible* to leave out semicolons most of time. But it's safer, especially for a beginner -- to put them.

## Comments

As the time goes, the program becomes more and more complex. It becomes necessary to add *comments* which describe what happens and why.

Comments can be put into any place of the script. They don't affect the execution, because the engine simply ignores them.

**One-line comments start with the two forward slash characters `//`.**

The rest of the line is a comment. It may occupy a full line of its own or follow a statement.

Like here:
```js run
// This comment occupies a line of its own
alert('Hello');

alert('World'); // This comment follows the statement
```

**Multiline comments start with a forward slash and an asterisk <code>"/&#42;"</code> and end with an asterisk and a forward slash <code>"&#42;/"</code>.**

Like this:

```js run
/* An example with two messages.
This is a multiline comment.
*/
alert('Hello');
alert('World');
```

The content of comments is ignored, so if we put a code inside <code>/&#42; ... &#42;/</code> it won't execute.

Sometimes it comes handy to temporarily disable a part of the code:

```js run
/* Commenting out the code
alert('Hello');
*/
alert('World');
```

```smart header="Use hotkeys!"
In most editors a line of code can be commented out by `key:Ctrl+/` hotkey for a single-line comment and something like `key:Ctrl+Shift+/` -- for multiline comments (select a code and press the hotkey). For Mac try `key:Cmd` instead of `key:Ctrl`.
```

````warn header="Nested comments are not supported!"
There may not be `/*...*/` inside another `/*...*/`.

This code will die with an error:

```js run no-beautify
/*
  /* nested comment ?!? */
*/
alert( 'World' );
```
````

Please, don't hesitate to comment your code.

Comments increase the overall code footprint, but that's not a problem at all. There are many tools which minify the code before publishing to production server. They remove comments, so comments do not appear in the working scripts. So, the comments do not have any negative effects on production at all.

Further in the tutorial, there will be a chapter <info:coding-style> that also explains how to write better comments.
