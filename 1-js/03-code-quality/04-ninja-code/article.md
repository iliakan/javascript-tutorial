# How to write bad code?

Programmer ninjas of the past used these tricks to make code maintainers cry. Code review gurus look for them in test tasks. Novice developers sometimes use them even better than programmer ninjas.

Read them carefully and find out who you are -- a ninja, a novice, or maybe a code reviewer?

[cut]

```warn header="Irony detected"
These are rules of writing bad code. Just... You know, some people miss the point.
```

## Brevity is the soul of wit

Make the code as short as possible. Show how smart you are.

Let subtle language features guide you.

For instance, take a look at this ternary operator `'?'`:

```js
// taken from a well-known javascript library
i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
```

Cool, right? If you write like that, the developer who comes across this line and tries to understand what is the value of `i` will probably have a merry time. Then come to you, seeking for an answer.

Tell him that shorter is always better. Initiate him into the paths of ninja.

## One-letter variables

```quote author="Laozi (Tao Te Ching)"
The Dao hides in wordlessness. Only the Dao is well begun and well
completed.
```

Another way to code faster (and much worse!) is to use single-letter variable names everywhere. Like `a`, `b` or `c`.

A short variable disappears in the code like a real ninja in the forest. No one will be able to find it using the "search" of the editor. And even if someone does, he won't be able to "decipher" what the name `a` or `b` means.

...But there's an exception. A real ninja will never use `i` as the counter in a `"for"` loop. Anywhere, but not here. Look around, there are so much more exotic letters. For instance, `x` or `y`.

An exotic variable as a loop counter is especially cool if the loop body takes 1-2 pages (make it longer if you can). Then if someone looks deep inside the loop, he won't be able to figure out fast that the variable is the loop counter.

## Use abbreviations

If the team rules forbid to use one-letter and vague names -- shorten them, make abbreviations.

Like this:

- `list` -> `lst`.
- `userAgent` -> `ua`.
- `browser` -> `brsr`.
- ...etc

Only the one with a truly good intuition will be able to understand all such names. Try to shorten everything. Only a worthy person will be able to uphold the development of such code.

## Soar high. Be abstract.

```quote author="Laozi (Tao Te Ching)"
The great square is cornerless<br>
The great vessel is last complete,<br>
The great note is rarified sound,<br>
The great image has no form.
```

While choosing a name try to use the most abstract word. Like `obj`, `data`, `value`, `item`, `elem` and so on.

- **The ideal name for a variable is `data`.** Use it everywhere where you can. Indeed, every variable holds *data*, right?

    ...But what to do if `data` is already taken? Try `value`, it's also universal. A variable always has a *value*, correct?

- **Name the variable by its type: `str`, `num`...**

    ...But will that make the code worse? Actually, yes!

    From one hand, the variable name still means something. It says what's inside the variable: a string, a number or something else. But when an outsider tries to understand the code -- he'll be surprised to see that there's actually no information at all!

    Actually, the value type is easy to see by debugging. But what's the meaning of the variable? Which string/number it stores? There's just no way to figure out without a good meditation!

- **...But what if there are no more such names?** Just add a letter: `item1, item2, elem5, data1`...

## Attention test

Only a truly attentive programmer should be able to understand the code. But how to check that?

**One of the ways -- use similar variable names, like `date` and `data`.**

Mix them where you can.

A quick read of such code becomes impossible. And when there's a typo... Ummm... We're stuck for long, time to drink tea.


## Smart synonyms

```quote author="Confucius"
The hardest thing of all is to find a black cat in a dark room, especially if there is no cat.
```

Use *similar* names for *same* things, that makes life more interesting and shows your creativity to the public.

For instance, the function prefixes. If a function shows a message on the screen -- start it with `display…`, like `displayMessage`. And then if another function shows something else, like a user name, start it with `show…` (like `showName`).

Insinuate that there's a subtle difference difference between such functions, while there is none.

Make a pact with fellow ninjas of the team: if John starts "showing" functions with `display...` in his code, then Peter could use `render..`, and Ann -- `paint...`. Note how more interesting and diverse the code became.

...And now the hat trick!

For two functions with important differences -- use the same prefix!

For instance, the function `printPage(page)` will use a printer. And the function `printText(text)` will put the text on-screen. Let an unfamiliar reader think well over things: "Where does `printMessage(message)` put the message? To a printer or on the screen?". To make it really shine, `printMessage(message)` should output it in the new window!

## Reuse names

```quote author="Laozi (Tao Te Ching)"
Once the whole is divided, the parts<br>
need names.<br>
There are already enough names.<br>
One must know when to stop.
```

Add a new variable only when absolutely necessary.

Instead, reuse existing names. Just write new values into them.

In a function try to use only variables passed as parameters.

That would make it impossible to identify what's exactly in the variable *now*. And also where it comes from. A person with weak intuition would have to analyze the code line-by-line and track the changes through every code branch.

**An advanced variant of the approach is to covertly (!) replace the value with something alike in the middle of a loop or a function.**

For instance:

```js
function ninjaFunction(elem) {
  // 20 lines of code working with elem

  elem = clone(elem);

  // 20 more lines, now working with the clone of the elem!
}
```

A fellow programmer who wants to work with `elem` in the second half of the function will be surprised... Only during the debugging, after examining the code he will find out that he's working with a clone!

Deadly effective even against an experienced ninja. Seen in code regularly.

## Underscores for fun

Put underscores `_` and `__` before variable names. Like `_name` or `__value`. It would be great if only you know their meaning. Or, better, without meaning at all.

You kill two rabbits with one shot. First, the code becomes longer and less readable, and the second, a fellow developer may spend a long time trying to figure out what the underscores mean.

A smart ninja puts underscores at one spot of code and evades them at other places. That makes the code even more fragile and increases the probability of future errors.

## Show your love

Let everyone see how magnificent your entities are! Names like `superElement`, `megaFrame` and `niceItem` will definitely enlighten a reader.

Indeed, from one hand, something is written: `super..`, `mega..`, `nice..` But from the other hand -- that brings no details. A reader may decide to look for a hidden meaning and meditate for an hour or two.

## Overlap outer variables

```quote author="Guan Yin Zi"
When in the light, can't see anything in the darkness.<br>
When in the darkness, can see everything in the light.
```

Use same names for variables inside and outside a function. As simple. No efforts required.

```js
let *!*user*/!* = authenticateUser();

function render() {
  let *!*user*/!* = anotherValue();
  ...
  ...many lines...
  ...
  ... // <-- a programmer wants to work with user here and...
  ...
}
```

A programmer who jumps inside the `render` will probably miss to notice that there's a local `user` shadowing the outer one.

Then he'll try to work with `user` it assuming that it's the external variable, the result of `authenticateUser()`... The trap is sprung! Hello, debugger...


## Side-effects everywhere!

There are functions that look like they don't change anything. Like `isReady()`, `checkPermission()`, `findTags()`... They are assumed to carry out calculations, find and return the data, without changing anything outside of them. That's called "no side-effects".

**A really beautiful trick -- is to add a "useful" action to them, besides the main task.**

The expression of dazed surprise on the face of your colleague when he see a function named `is..`, `check..` or `find...` changing something -- will definitely broaden your boundaries of reason.

**Another way to surprise -- is to return a non-standard result.**

Show your original thinking! Let the call of `checkPermission` return not `true/false`, but a complex object with the results of the check.

Those developers who try to write `if (checkPermission(..))`, will wonder why it doesn't work. Tell them: "Read the docs!". And give this article.


## Powerful functions!

```quote author="Laozi (Tao Te Ching)"
The great Tao flows everywhere,<br>
both to the left and to the right.
```

Don't limit the function by what's written in its name. Be broader.

For instance, a function `validateEmail(email)` could (besides checking the email for correctness) show an error message and ask to re-enter the email.

Additional actions should not be obvious from the function name. A true ninja coder will make them not obvious from the code as well.

**Joining several actions into one protects your code from reuse.**

Imagine, another developer wants only to check the email, and not output any message. Your function  `validateEmail(email)` that does both will not suit him. So he won't break your meditation by asking anything about it.

## Summary

All "pieces of advice" above are from real code... Sometimes, written by experienced developers. Maybe even more experienced than you are ;)

- Follow some of them -- and your code will become full of surprises.
- Follow many of them -- and your code will become truly yours, no one would want to change it.
- Follow all -- and your code will become a valuable lesson for young developers looking for enlightment.
