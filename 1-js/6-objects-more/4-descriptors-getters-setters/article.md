# Дескрипторы, геттеры и сеттеры свойств

В этой главе мы рассмотрим возможности, которые позволяют очень гибко и мощно управлять всеми свойствами объекта, включая их аспекты -- изменяемость, видимость в цикле `for..in` и даже незаметно делать их функциями.

Они поддерживаются всеми современными браузерами, но не IE8-. Впрочем, даже в IE8 их поддерживает, но только для DOM-объектов (используются при работе со страницей, это сейчас вне нашего рассмотрения).

[cut]
## Дескрипторы в примерах

Основной метод для управления свойствами -- [Object.defineProperty](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/defineProperty).

Он позволяет объявить свойство объекта и, что самое главное, тонко настроить его особые аспекты, которые никак иначе не изменить.

Синтаксис:

```js
Object.defineProperty(obj, prop, descriptor)
```

Аргументы:
<dl>
<dt>`obj`</dt>
<dd>Объект, в котором объявляется свойство.</dd>
<dt>`prop`</dt>
<dd>Имя свойства, которое нужно объявить или модифицировать.</dd>
<dt>`descriptor`</dt>
<dd>Дескриптор -- объект, который описывает поведение свойства.</dd>
</dl>

В нём могут быть следующие поля:

<ul>
<li>`value` -- значение свойства, по умолчанию `undefined`</li>
<li>`writable` -- значение свойства можно менять, если `true`. По умолчанию `false`.</li>
<li>`configurable` -- если `true`, то свойство можно удалять, а также менять его в дальнейшем при помощи новых вызовов `defineProperty`. По умолчанию `false`.</li>
<li>`enumerable` -- если `true`, то свойство будет участвовать в переборе `for..in`. По умолчанию `false`.</li>
<li>`get` -- функция, которая возвращает значение свойства. По умолчанию `undefined`.</li>
<li>`set` -- функция, которая записывает значение свойства. По умолчанию `undefined`.</li>
</ul>

Чтобы избежать конфликта, запрещено одновременно указывать значение `value` и функции `get/set`. Либо значение, либо функции для его чтения-записи, одно из двух. Также запрещено и не имеет смысла указывать `writable` при наличии `get/set`-функций.

Далее мы подробно разберём эти свойства на примерах.

## Обычное свойство

Два таких вызова работают одинаково:

```js
//+ no-beautify
var user = {};

// 1. простое присваивание
user.name = "Вася";

// 2. указание значения через дескриптор
Object.defineProperty(user, "name", { value: "Вася", configurable: true, writable: true, enumerable: true });
```

Оба вызова выше добавляют в объект `user` обычное (удаляемое, изменяемое, перечисляемое) свойство.

## Свойство-константа

Для того, чтобы сделать свойство неизменяемым, изменим его флаги `writable` и `configurable`:

```js
//+ run
*!*
"use strict";
*/!*

var user = {};

Object.defineProperty(user, "name", {
  value: "Вася",
*!*
  writable: false, // запретить присвоение "user.name=" 
  configurable: false // запретить удаление "delete user.name"
*/!*
});

// Теперь попытаемся изменить это свойство.

// в strict mode присвоение "user.name=" вызовет ошибку
*!*
user.name = "Петя";
*/!*
```

Заметим, что без `use strict` операция записи "молча" не сработает. Лишь если установлен режим `use strict`, то дополнительно сгенерируется ошибка.

## Свойство, скрытое для for..in

Встроенный метод `toString`, как и большинство встроенных методов, не участвует в цикле `for..in`. Это удобно, так как обычно такое свойство является "служебным".

К сожалению, свойство `toString`, объявленное обычным способом, будет видно в цикле `for..in`, например:

```js
//+ run no-beautify
var user = {
  name: "Вася",
  toString: function() { return this.name; }
};

*!*
for(var key in user) alert(key);  // name, toString
*/!*
```

Мы бы хотели, чтобы поведение нашего метода `toString` было таким же, как и стандартного.

`Object.defineProperty` может исключить `toString` из списка итерации, поставив ему флаг `enumerable: false`. По стандарту, у встроенного `toString` этот флаг уже стоит.

```js
//+ run no-beautify
var user = {
  name: "Вася",
  toString: function() { return this.name; }
};

*!*
// помечаем toString как не подлежащий перебору в for..in
Object.defineProperty(user, "toString", {enumerable: false});

for(var key in user) alert(key);  // name
*/!*
```

Обратим внимание, вызов `defineProperty` не перезаписал свойство, а просто модифицировал настройки у существующего `toString`.

## Свойство-функция

Дескриптор позволяет задать свойство, которое на самом деле работает как функция. Для этого в нём нужно указать эту функцию в `get`.

Например, у объекта `user` есть обычные свойства: имя `firstName` и фамилия `surname`. 

Создадим свойство `fullName`, которое на самом деле является функцией:

```js
//+ run
var user = {
  firstName: "Вася",
  surname: "Петров"
}

Object.defineProperty(user, "fullName", {
  *!*get*/!*: function() {
    return this.firstName + ' ' + this.surname;
  }
});

*!*
alert(user.fullName); // Вася Петров
*/!*
```

Обратим внимание, снаружи `fullName` -- это обычное свойство `user.fullName`. Но дескриптор указывает, что на самом деле его значение возвращается функцией.

Также можно указать функцию, которая используется для записи значения, при помощи дескриптора `set`.

Например, добавим возможность присвоения `user.fullName` к примеру выше:

```js
//+ run
var user = {
  firstName: "Вася",
  surname: "Петров"
}

Object.defineProperty(user, "fullName", {

  get: function() {
    return this.firstName + ' ' + this.surname;
  },

*!*
  set: function(value) {
      var split = value.split(' ');
      this.firstName = split[0];
      this.surname = split[1];
    }
*/!*
});

*!*
user.fullName = "Петя Иванов";
*/!*
alert( user.firstName ); // Петя 
alert( user.surname ); // Иванов
```

## Указание get/set в литералах

Если мы создаём объект при помощи синтаксиса `{ ... }`,  то задать свойства-функции можно прямо в его определении.

Для этого используется особый синтаксис: `get свойство` или `set свойство`. 

Например, ниже объявлен геттер-сеттер `fullName`:

```js
//+ run
var user = {
  firstName: "Вася",
  surname: "Петров",

*!*
  get fullName() {
*/!*
    return this.firstName + ' ' + this.surname;
  },

*!*
  set fullName(value) {
*/!*
    var split = value.split(' ');
    this.firstName = split[0];
    this.surname = split[1];
  }
};

*!*
alert( user.fullName ); // Вася Петров (из геттера)

user.fullName = "Петя Иванов";
alert( user.firstName ); // Петя  (поставил сеттер)
alert( user.surname ); // Иванов (поставил сеттер)
*/!*
```

## Да здравствуют get/set!

Казалось бы, зачем нам назначать get/set для свойства через всякие хитрые вызовы, когда можно сделать просто функции с самого начала? Например, `getFullName`, `setFullName`...

Конечно, в ряде случаев свойства выглядят короче, такое решение просто может быть красивым. Но основной бонус -- это гибкость, возможность получить контроль над свойством в любой момент!

Например, в начале разработки мы используем обычные свойства, например у `User` будет имя `name` и возраст `age`:

```js
function User(name, age) {
  this.name = name;
  this.age = age;
}

var pete = new User("Петя", 25);

alert( pete.age ); // 25
```

С обычными свойствами в коде меньше букв, они удобны, причины использовать функции пока нет.

...Но рано или поздно могут произойти изменения. Например, в `User` может стать более целесообразно вместо возраста `age` хранить дату рождения `birthday`:

```js
function User(name, birthday) {
  this.name = name;
  this.birthday = birthday;
}

var pete = new User("Петя", new Date(1987, 6, 1));
```

Что теперь делать со старым кодом, который выводит свойство `age`? 

Можно, конечно, найти все места и поправить их, но это долго, а иногда и невозможно, скажем, если вы взаимодействуете со сторонней библиотекой, код в которой -- чужой и влезать в него нежелательно.

Добавление `get`-функции `age` позволяет обойти проблему легко и непринуждённо:

```js
//+ run no-beautify
function User(name, birthday) {
  this.name = name;
  this.birthday = birthday;

*!*
  // age будет высчитывать возраст по birthday
  Object.defineProperty(this, "age", {
    get: function() {
      var todayYear = new Date().getFullYear();
      return todayYear - this.birthday.getFullYear();
    }
  });
*/!*
}

var pete = new User("Петя", new Date(1987, 6, 1));

alert( pete.birthday ); // и дата рождения доступна
alert( pete.age );      // и возраст
```

Заметим, что `pete.age` снаружи как было свойством, так и осталось. То есть, переписывать внешний код на вызов функции `pete.age()` не нужно.

Таким образом, `defineProperty` позволяет нам начать с обычных свойств, а в будущем, при необходимости, можно в любой момент заменить их на функции, реализующие более сложную логику.

## Другие методы работы со свойствами

<dl>
<dt>[Object.defineProperties(obj,descriptors)](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/defineProperties)</dt>
<dd>Позволяет объявить несколько свойств сразу:</dd>
</dl>

```js
//+ run
var user = {}

Object.defineProperties(user, {
*!*
  firstName: {
*/!*
    value: "Петя"
  },

*!*
  surname: {
*/!*
    value: "Иванов"
  },

*!*
  fullName: {
*/!*
    get: function() {
      return this.firstName + ' ' + this.surname;
    }
  }
});

alert( user.fullName ); // Петя Иванов
```

<dl>
<dt>[Object.keys(obj)](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys), [Object.getOwnPropertyNames(obj)](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)</dt>
<dd>Возвращают массив -- список свойств объекта.</dd>
</dl>

`Object.keys` возвращает только `enumerable`-свойства.

`Object.getOwnPropertyNames` -- возвращает все:

```js
//+ run
var obj = {
  a: 1,
  b: 2,
  internal: 3
};

Object.defineProperty(obj, "internal", {
  enumerable: false
});

*!*
alert( Object.keys(obj) ); // a,b 
alert( Object.getOwnPropertyNames(obj) ); // a, internal, b
*/!*
```
<dl>
<dt>[Object.getOwnPropertyDescriptor(obj, prop)](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)</dt>
<dd>Возвращает дескриптор для свойства `obj[prop]`.</dd>
</dl>

Полученный дескриптор можно изменить и использовать `defineProperty` для сохранения изменений, например:

```js
//+ run
var obj = {
  test: 5
};
*!*
var descriptor = Object.getOwnPropertyDescriptor(obj, 'test');
*/!*

*!*
// заменим value на геттер, для этого...
*/!*
delete descriptor.value; // ..нужно убрать value/writable
delete descriptor.writable;
descriptor.get = function() { // и поставить get
  alert( "Preved :)" );
};

*!*
// поставим новое свойство вместо старого
*/!*

// если не удалить - defineProperty объединит старый дескриптор с новым
delete obj.test;

Object.defineProperty(obj, 'test', descriptor);

obj.test; // Preved :)
```

...И несколько методов, которые используются очень редко:
<dl>
<dt>[Object.preventExtensions(obj)](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)</dt>
<dd>Запрещает добавление свойств в объект.</dd>
<dt>[Object.seal(obj)](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/seal)</dt>
<dd>Запрещает добавление и удаление свойств, все текущие свойства делает `configurable: false`.</dd>
<dt>[Object.freeze(obj)](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/freeze)</dt>
<dd>Запрещает добавление, удаление и изменение свойств, все текущие свойства делает `configurable: false, writable: false`.</dd>
<dt>[Object.isExtensible(obj)](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/isExtensible), [Object.isSealed(obj)](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/isSealed), [Object.isFrozen(obj)](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/isFrozen)</dt>
<dd>Возвращают `true`, если на объекте были вызваны методы `Object.preventExtensions/seal/freeze`.</dd>
</dl>

