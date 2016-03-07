# Strings

In JavaScript all textual data is stored as strings. There is no separate type for a single character.

The internal format is always [Unicode](https://en.wikipedia.org/wiki/Unicode), it is not tied to the page encoding.

[cut]

## Quotes

Let's remember the kinds of quotes.

Strings can be enclosed either with the single, double quotes or in backticks:

```js
let single = 'single-quoted';
let double = "double-quoted";

let backticks = `backticks`;
```

Single and double quotes are essentially the same. Backticks allow to embed any expression into the string, including function calls:

```js run
function sum(a, b) {
  return a + b;
}

alert(`1 + 2 = ${sum(1, 2)}.`); // 1 + 2 = 3.
```

Another advantage of using backticks is that they allow to create a multiline string:

```js run
let guestList = `Guests:
 * John
 * Pete
 * Mary
`;

alert(guestList); // a list of guests, multiple lines
```

If we try to use single or double quotes the same way, there will be an error:
```js run
let guestList = "Guests:  // Error: Unexpected token ILLEGAL
  * John";
```

That's because they come from ancient times of language creation, and the need for multiline strings was not taken into account. Backticks appeared much later.

In modern JavaScript, there is usually no need to use old-style quotes. 

## Special characters

It is still possible to create multiline strings with single quotes, using a so-called "newline character" written as `\n`, that denotes a line break:

```js run
let guestList = "Guests:\n * John\n * Pete\n * Mary";

alert(guestList); // a list of guests, multiple lines, same as with backticks above
```

So to speak, these two `alert`s show the same: 

```js run
alert( 'Hello\nWorld' ); 

alert( `Hello
World` );
```

There are other, less common "special" characters as well, here's the list:

| Character | Description |
|-----------|-------------|
|`\b`|Backspace|
|`\f`|Form feed|
|`\n`|New line|
|`\r`|Carriage return|
|`\t`|Tab|
|`\uNNNN`|A unicode symbol with the hex code `NNNN`, for instance `\u00A9` -- is a unicode for the copyright symbol `©`. Must be exactly 4 hex digits. |
|`\u{NNNNNNNN}`|Some rare characters are encoded with two unicode symbols, taking up to 4 bytes. The long unicode requires braces around.|

For example:

```js run
alert( "\u00A9" ); // ©
alert( "\u{20331}" ); // 𠌱, the chinese hieroglyph 
```

As we can see, all special characters start with a backslash character `\`. It is also called an "escaping character".

Another use of it is an insertion of the enclosing quote into the string.

For instance:

```js run
alert( '*!*I\'m*/!* the Walrus!' ); // *!*I'm*/!* the Walrus!
```

See, we have to prepend the inner quote by the backslash `\'`, because otherwise it would mean the string end.

As a more elegant solution, we could wrap the string in double quotes or backticks instead:

```js run
alert( `I'm the Walrus!` ); // I'm the Walrus! 
```

Most of time when we know we're going to use this or that kind of quotes inside of the string, we can choose non-conflicting quotes to enclose it. 

Note that the backslash `\` serves for the correct reading of the string by JavaScript, then disappears. The in-memory string has no `\`. You can clearly see that in `alert` from the examples above.

But what if we need exactly a backslash `\` in the string?

That's possible, but we need to double it like `\\`:

```js run
alert( `The backslash: \\` ); // The backslash: \
```

## The length and characters

- The `length` property has the string length: 

    ```js run
    alert( `My\n`.length ); // 3
    ```

    Note that `\n` is a single character.

- Use square brackets `[position]` or the method [str.charAt(position)](mdn:String/charAt) to access a character.

    The first character starts from the zero position:

    ```js run
    let str = `Hello`;

    // the first character
    alert( str[0] ); // H
    alert( str.charAt(0) ); // H

    // the last character
    alert( str[str.length - 1] ); // o
    ```

    The square brackets is a modern way, while `charAt` exists mostly for historical reasons.

    The only difference between them is that if no character found, `[]` returns `undefined` while `charAt` returns an empty string:

    ```js run
    let str = `Hello`;

    alert( str[1000] ); // undefined
    alert( str.charAt(1000) ); // '' (an empty string)
    ```

```warn header="`length` is a property"
Please note that `str.length` is a numeric property, not a function. 

There is no need to add brackets after it. The call `str.length()` won't work.
```

## Strings are immutable

Strings can't be changed in JavaScript. It is impossible to change a character. 

Let's try to see that it doesn't work:

```js run
let str = 'Hi';

str[0] = "h"; // error
alert( str[0] ); // doesn't work
```

The usual workaround is to create a whole new string and assign it to `str` instead of the old one.

For instance:

```js run
let str = 'Hi';

str = "h" + str[1]; 
alert( str ); // hi
```

## Changing the case

Methods [toLowerCase()](mdn:String/toLowerCase) and [toUpperCase()](mdn:String/toUpperCase) change the case:

```js run
alert( "Interface".toUpperCase() ); // INTERFACE
alert( "Interface".toLowerCase() ); // interface
```

Or, if we want a single character lowercased:

```js
alert( "Interface"[0].toLowerCase() ); // 'i'
```

## Finding substrings

There are few ways to look for a substring in a string.

### str.indexOf

The first method is [str.indexOf(substr, pos)](mdn:String/indexOf). 

It looks for the `substr` in `str`, starting from the given position `pos`, and returns the position where the match was found or `-1` if nothing found.

For instance:

```js run
let str = "Widget with id";

alert( str.indexOf("Widget") ); // 0, because "Widget" is found at the beginning
alert( str.indexOf("widget") ); // -1, not found, the search is case-sensitive

alert( str.indexOf("id") ); // 1, "id" is found at the position 1 (..idget with id)
```

The optional second parameter allows to search starting from the given position.

For instance, the first occurence of `"id"` is at the position `1`. To look for the next occurence, let's start the search from the position `2`:

```js run
let str = "Widget with id";

alert( str.indexOf("id", 2) ) // 12
```


If we're interested in all occurences, we can run `indexOf` in a loop. Every new call is made with the position after the previous match:


```js run
let str = "As sly as a fox, as strong as an ox"; 

let target = "as"; // let's look for it

let pos = 0;
while (true) {
  let foundPos = str.indexOf(target, pos);
  if (foundPos == -1) break;

  alert( `Found at ${foundPos}` ); 
  pos = foundPos + 1; // continue the search from the next position
}
```

The same algorithm can be layed out shorter:

```js run
let str = "As sly as a fox, as strong as an ox";
let target = "as";

*!*
let pos = -1;
while ((pos = str.indexOf(target, pos + 1)) != -1) {
  alert( pos );
}
*/!*
```

```smart header="`str.lastIndexOf(pos)`"
There is also a similar method [str.lastIndexOf(pos)](mdn:String/lastIndexOf) that searches from the end of the string to its beginning.

It would list the occurences in the reverse way.
```

The main problem with `indexOf` is inconvenience of `-1` in case when nothing found. 

So a simple `if` check with it won't work:

```js run
let str = "Widget with id";

if (str.indexOf("Widget")) {
    alert("We found it"); // won't work
}
```

That's because `str.indexOf("Widget")` returns `0` (found at the starting position). Right, but `if` considers that `false`.

So, we should actualy check for `-1`, like that:

```js run
let str = "Widget with id";

*!*
if (str.indexOf("Widget") != -1) {
*/!* 
    alert("We found it"); // works now!
}
```

````smart header="The bitwise NOT trick"
One of the old tricks used here is the [bitwise NOT](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_NOT) `~` operator. For 32-bit integers the call `~n` is the same as `-(n+1)`. 

For instance:

```js run
alert( ~2 ); // -(2+1) = -3
alert( ~1 ); // -(1+1) = -2
alert( ~0 ); // -(0+1) = -1
*!*
alert( ~-1 ); // -(-1+1) = 0
*/!*
```
As we can see, `~n` is zero only if `n == -1`.

So, `if ( ~str.indexOf("...") )` means that the `indexOf` result is different from `-1`.

People use it to shorten `indexOf` checks:

```js run
let str = "Widget";

if (~str.indexOf("Widget")) {
  alert( 'Found it!' ); // works
}
```

It is usually not recommended to use language features in a non-obvious way, but this particular trick is widely used, generally JavaScript programmers understand it.

Just remember: `if (~str.indexOf(...))` reads as "if found".
````

### str.includes

The more modern method [str.includes(substr)](mdn:String/includes) returns `true/false` depending on whether `str` has `substr` as its part.

That's usually a simpler way to go if we don't need the exact position:

```js run
alert( "Widget with id".includes("Widget") ); // true

alert( "Hello".includes("Bye") ); // false
```

## Extracting a substring

В JavaScript существуют целых 3 (!) метода для взятия подстроки, с небольшими отличиями между ними.

`substring(start [, end])`
: Метод `substring(start, end)` возвращает подстроку с позиции `start` до, но не включая `end`.

    ```js run
    let str = "*!*s*/!*tringify";
    alert(str.substring(0,1)); // "s", символы с позиции 0 по 1 не включая 1.
    ```

    Если аргумент `end` отсутствует, то идет до конца строки:

    ```js run
    let str = "st*!*ringify*/!*";
    alert(str.substring(2)); // ringify, символы с позиции 2 до конца
    ```

<dt>`substr(start [, length])`
: Первый аргумент имеет такой же смысл, как и в `substring`, а второй содержит не конечную позицию, а количество символов.

    ```js run
    let str = "st*!*ring*/!*ify";
    str = str.substr(2,4); // ring, со 2-й позиции 4 символа
    alert(str)
    ```

    Если второго аргумента нет -- подразумевается "до конца строки".

`slice(start [, end])`
: Возвращает часть строки от позиции `start` до, но не включая, позиции `end`. Смысл параметров -- такой же как в `substring`.

### Отрицательные аргументы

Различие между `substring` и `slice` -- в том, как они работают с отрицательными и выходящими за границу строки аргументами:

`substring(start, end)`
: Отрицательные аргументы интерпретируются как равные нулю. Слишком большие значения усекаются до длины строки:

    ```js run
    alert( "testme".substring(-2) ); // "testme", -2 становится 0
    ```

    Кроме того, если <code>start &gt; end</code>, то аргументы меняются местами, т.е. возвращается участок строки *между* `start` и `end`:

    ```js run
    alert( "testme".substring(4, -1) ); // "test"
    // -1 становится 0 -> получили substring(4, 0)
    // 4 > 0, так что аргументы меняются местами -> substring(0, 4) = "test"
    ```

`slice`
: Отрицательные значения отсчитываются от конца строки:

    ```js run
    alert( "testme".slice(-2) ); // "me", от 2 позиции с конца
    ```

    ```js run
    alert( "testme".slice(1, -1) ); // "estm", от 1 позиции до первой с конца.
    ```

    Это гораздо более удобно, чем странная логика `substring`.

Отрицательное значение первого параметра поддерживается в `substr` во всех браузерах, кроме IE8-.

Если выбирать из этих трёх методов один, для использования в большинстве ситуаций -- то это будет `slice`: он и отрицательные аргументы поддерживает и работает наиболее очевидно.

## Кодировка Юникод

Как мы знаем, символы сравниваются в алфавитном порядке `'А' < 'Б' < 'В' < ... < 'Я'`.

Но есть несколько странностей..

1. Почему буква `'а'` маленькая больше буквы `'Я'` большой?

    ```js run
    alert( 'а' > 'Я' ); // true
    ```
2. Буква `'ё'` находится в алфавите между `е` и `ж`: <code>абвгде**ё**жз..</code>. Но почему тогда `'ё'` больше `'я'`?

    ```js run
    alert( 'ё' > 'я' ); // true
    ```

Чтобы разобраться с этим, обратимся к внутреннему представлению строк в JavaScript.

**Все строки имеют внутреннюю кодировку [Юникод](http://ru.wikipedia.org/wiki/%D0%AE%D0%BD%D0%B8%D0%BA%D0%BE%D0%B4).**

Неважно, на каком языке написана страница, находится ли она в windows-1251 или utf-8. Внутри JavaScript-интерпретатора все строки приводятся к единому "юникодному" виду. Каждому символу соответствует свой код.

Есть метод для получения символа по его коду:

String.fromCharCode(code)
: Возвращает символ по коду `code`:

    ```js run
    alert( String.fromCharCode(1072) ); // 'а'
    ```

...И метод для получения цифрового кода из символа:

str.charCodeAt(pos)
: Возвращает код символа на позиции `pos`. Отсчет позиции начинается с нуля.

    ```js run
    alert( "абрикос".charCodeAt(0) ); // 1072, код 'а'
    ```

Теперь вернемся к примерам выше. Почему сравнения `'ё' > 'я'` и `'а' > 'Я'` дают такой странный результат?

Дело в том, что **символы сравниваются не по алфавиту, а по коду**. У кого код больше -- тот и больше. В юникоде есть много разных символов. Кириллическим буквам соответствует только небольшая часть из них, подробнее -- [Кириллица в Юникоде](http://ru.wikipedia.org/wiki/%D0%9A%D0%B8%D1%80%D0%B8%D0%BB%D0%BB%D0%B8%D1%86%D0%B0_%D0%B2_%D0%AE%D0%BD%D0%B8%D0%BA%D0%BE%D0%B4%D0%B5).

Выведем отрезок символов юникода с кодами от `1034` до `1113`:

```js run
let str = '';
for (let i = 1034; i <= 1113; i++) {
  str += String.fromCharCode(i);
}
alert( str );
```

Результат:
<div style="overflow: auto">
<code>ЊЋЌЍЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяѐёђѓєѕіїјљ</code>
</div>

Мы можем увидеть из этого отрезка две важных вещи:

1. **Строчные буквы идут после заглавных, поэтому они всегда больше.**

    В частности, `'а'(код 1072) > 'Я'(код 1071)`.

    То же самое происходит и в английском алфавите, там `'a' > 'Z'`.
2. **Ряд букв, например `ё`, находятся вне основного алфавита.**

    В частности, маленькая буква `ё` имеет код, больший чем `я`, поэтому **`'ё'(код 1105) > 'я'(код 1103)`**.

    Кстати, большая буква `Ё` располагается в Unicode до `А`, поэтому **`'Ё'`(код 1025) < `'А'`(код 1040)**. Удивительно: есть буква меньше чем `А` :)

**Буква `ё` не уникальна, точки над буквой используются и в других языках, приводя к тому же результату.**

Например, при работе с немецкими названиями:

```js run
alert( "ö" > "z" ); // true
```

```smart header="Юникод в HTML"
Кстати, если мы знаем код символа в кодировке юникод, то можем добавить его в HTML, используя "числовую ссылку" (numeric character reference).

Для этого нужно написать сначала `&#`, затем код, и завершить точкой с запятой `';'`. Например, символ `'а'` в виде числовой ссылки: `&#1072;`.

Если код хотят дать в 16-ричной системе счисления, то начинают с `&#x`.

В юникоде есть много забавных и полезных символов, например, символ ножниц: &#x2702; (`&#x2702;`), дроби: &#xBD; (`&#xBD;`) &#xBE; (`&#xBE;`) и другие. Их можно использовать вместо картинок в дизайне.
```

## Посимвольное сравнение

Сравнение строк работает *лексикографически*, иначе говоря, посимвольно.

Сравнение строк `s1` и `s2` обрабатывается по следующему алгоритму:

1. Сравниваются первые символы: `s1[0]` и `s2[0]`. Если они разные, то сравниваем их и, в зависимости от результата их сравнения, возвратить `true` или `false`. Если же они одинаковые, то...
2. Сравниваются вторые символы `s1[1]` и `s2[1]`
3. Затем третьи `s1[2]` и `s2[2]` и так далее, пока символы не будут наконец разными, и тогда какой символ больше -- та строка и больше. Если же в какой-либо строке закончились символы, то считаем, что она меньше, а если закончились в обеих -- они равны.

Спецификация языка определяет этот алгоритм более детально. Если же говорить простыми словами, смысл алгоритма в точности соответствует порядку, по которому имена заносятся в орфографический словарь.

```js
"Вася" > "Ваня" // true, т.к. начальные символы совпадают, а потом 'с' > 'н'
"Дома" > "До" // true, т.к. начало совпадает, но в 1-й строке больше символов
```

````warn header="Числа в виде строк сравниваются как строки"
Бывает, что числа приходят в скрипт в виде строк, например как результат `prompt`. В этом случае результат их сравнения будет неверным:

```js run
alert( "2" > "14" ); // true, так как это строки, и для первых символов верно "2" > "1"
```

Если хотя бы один аргумент -- не строка, то другой будет преобразован к числу:

```js run
alert( 2 > "14" ); // false
```
````

## Правильное сравнение

Все современные браузеры, кроме IE10- (для которых нужно подключить библиотеку [Intl.JS](https://github.com/andyearnshaw/Intl.js/)) поддерживают стандарт [ECMA 402](http://www.ecma-international.org/ecma-402/1.0/ECMA-402.pdf), поддерживающий сравнение строк на разных языках, с учётом их правил.

Способ использования:

```js run
let str = "Ёлки";

alert( str.localeCompare("Яблони") ); // -1
```

Метод `str1.localeCompare(str2)` возвращает `-1`, если `str1 < str2`, `1`, если `str1 > str2` и `0`, если они равны.

Более подробно про устройство этого метода можно будет узнать в статье <info:intl>, когда это вам понадобится.

## Итого

- Строки в JavaScript имеют внутреннюю кодировку Юникод. При написании строки можно использовать специальные символы, например `\n` и вставлять юникодные символы по коду.
- Мы познакомились со свойством `length` и методами `charAt`, `toLowerCase/toUpperCase`, `substring/substr/slice` (предпочтителен `slice`). Есть и другие методы, например [trim](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim) обрезает пробелы с начала и конца строки.
- Строки сравниваются побуквенно. Поэтому если число получено в виде строки, то такие числа могут сравниваться некорректно, нужно преобразовать его к типу *number*.
- При сравнении строк следует иметь в виду, что буквы сравниваются по их кодам. Поэтому большая буква меньше маленькой, а буква `ё` вообще вне основного алфавита.
- Для правильного сравнения существует целый стандарт ECMA 402. Это не такое простое дело, много языков и много правил. Он поддерживается во всех современных браузерах, кроме IE10-, в которых нужна библиотека <https://github.com/andyearnshaw/Intl.js/>. Такое сравнение работает через вызов `str1.localeCompare(str2)`.

Больше информации о методах для строк можно получить в справочнике: <http://javascript.ru/String>.