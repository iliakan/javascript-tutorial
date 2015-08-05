
# Proxy

*Прокси* (proxy) -- особый объект, смысл которого -- перехватывать обращения к другому объекту и, при необходимости, модифицировать их.

Синтаксис:

```js
let proxy = new Proxy(target, handler)
```

Здесь:

<ul>
<li>`target` -- объект, обращения к которому надо перехватывать.</li>
<li>`handler` -- объект с "ловушками": функциями-перехватчиками для операций к `target`.</li>
</ul>

Почти любая операция может быть перехвачена и обработана прокси до или даже вместо доступа к объекту `target`, например: чтение и запись свойств, получение списка свойств, вызов функции (если `target` -- функция) и т.п.

Различных типов ловушек довольно много.

Сначала мы подробно рассмотрим самые важные "ловушки", а затем посмотрим и на их полный список. 

[smart header="Если ловушки нет -- операция идёт над `target`"]
Если для операции нет ловушки, то она выполняется напрямую над `target`.
[/smart]

## get/set

Самыми частыми являются ловушки для чтения и записи в объект:

<dl>
<dt>`get(target, property, receiver)`</dt>
<dd>Срабатывает при чтении свойства из прокси.
Аргументы:
<ul>
<li>`target` -- целевой объект, тот же который был передан первым аргументом в `new Proxy`.</li>
<li>`property` -- имя свойства.</li>
<li>`receiver` -- объект, к которому было применено присваивание, обычно сам прокси, либо прототипно наследующий от него.</li>
</ul>

</dd>
<dt>`set(target, property, value, receiver)`</dt>
<dd>Срабатывает при записи свойства в прокси. 

Аргументы:
<ul>
<li>`target` -- целевой объект, тот же который был передан первым аргументом в `new Proxy`.</li>
<li>`property` -- имя свойства.</li>
<li>`value` -- значение свойства.</li>
<li>`receiver` -- объект, к которому было применено присваивание, обычно сам прокси, либо прототипно наследующий от него.</li>
</ul>
Метод `set` должен вернуть `true`, если присвоение успешно обработано и `false` в случае ошибки (приведёт к генерации `TypeError`).
</dd>
</dl>

Пример с выводом всех операций чтения и записи:

```js
//+ run
'use strict';

let user = {};

let proxy = new Proxy(user, {
  get(target, prop) {
*!*
    alert(`Чтение ${prop}`);
*/!*  
    return target[prop];
  },
  set(target, prop, value) {
*!*
    alert(`Запись ${prop} ${value}`);
*/!*  
    target[prop] = value;
    return true;
  }
});

proxy.firstName = "Ilya"; // запись

proxy.firstName; // чтение

alert(user.firstName); // Ilya
```

При каждой операции чтения и записи свойств `proxy` в коде выше срабатывают методы `get/set`. Через них значение в конечном счёте попадает в объект (или считывается из него).

Можно сделать и позаковырестее.

Методы `get/set` позволяют реализовать доступ к произвольным свойствам, которых в объекте нет.

Например, в коде ниже словарь `dictionary` содержит различные фразы:

```js
//+ run
'use strict';

let dictionary = {
  'Hello': 'Привет',
  'Bye': 'Пока'
};

alert( dictionary['Hello'] ); // Привет
```

А что, если фразы нет? В этом случае будем возвращать фразу без перевода и, на всякий случай, писать об этом в консоль:


```js
//+ run
'use strict';

let dictionary = {
  'Hello': 'Привет',
  'Bye': 'Пока'
};

dictionary = new Proxy(dictionary, {
  get(target, phrase) {
    if (phrase in target) {
      return target[phrase];
    } else {
      console.log(`No phrase: ${phrase}`);
      return phrase;
    }
  }
})

*!*
// Обращаемся к произвольным свойствам словаря!
*/!*
alert( dictionary['Hello'] ); // Привет
alert( dictionary['Welcome']); // Welcome (без перевода)
```

Аналогично и перехватчик `set` может организовать работу с произвольными свойствами.

# has

Ловушка `has` срабатывает в операторе `in` и некоторых других случаях, когда проверяется наличие свойства.

В примере выше, если проверить наличие свойства `Welcome` в `dictionary`, то оператор `in` вернёт `false`:

```js
alert( 'Hello' in dictionary ); // true
alert( 'Welcome' in dictionary ); // false, нет такого свойства
```

Это потому, что для перехвата `in` используется ловушка `has`. При отсутствии ловушки операция производится напрямую над исходным объектом `target`, что и даёт такой результат.

Синтаксис `has` аналогичен `get`.

Вот так `dictionary` будет всегда возвращать `true` для любой `in`-проверки:

```js
//+ run
'use strict';

let dictionary = {
  'Hello': 'Привет'
};

dictionary = new Proxy(dictionary, {
  has(target, phrase) {
    return true;
  }
});

*!*
alert("BlaBlaBla" in dictionary); // true
*/!*
```

# deleteProperty

Ловушка `deleteProperty` по синтаксису аналогична `get/has`. 

Срабатывает при операции `delete`, должна вернуть `true`, если удаление было успешным.

В примере ниже `delete` не повлияет на исходный объект, так как все операции перехватываются и "аннигилируются" прокси:

```js
//+ run
'use strict';

let dictionary = {
  'Hello': 'Привет'
};

let proxy = new Proxy(dictionary, {
  deleteProperty(target, phrase) {
    return true; // ничего не делаем, но возвращает true
  }
});

*!*
// не удалит свойство
delete proxy['Hello'];
*/!*

alert("Hello" in dictionary); // true

// будет то же самое, что и выше
// так как нет ловушки has, операция in сработает на исходном объекте
alert("Hello" in proxy); // true
```


# enumerate

Ловушка `enumerate` перехватывает операции `for..in` и `for..of` по объекту.

Как и до ранее, если ловушки нет, то эти операторы работают с исходным объектом:

```js
//+ run
'use strict';

let obj = {a: 1, b: 1};

let proxy = new Proxy(obj, {});

*!*
// перечисление прокси работает с исходным объектом
*/!*
for(let prop in proxy) {
  alert(prop); // Выведет свойства obj: a, b
}
```

Если же ловушка `enumerate` есть, то она будет вызвана с единственным аргументом `target` и сможет вернуть [итератор](/iterator) для свойств.

В примере ниже прокси делает так, что итерация идёт по всем свойствам, кроме начинающихся с подчёркивания `_`:

```js
//+ run
'use strict';

let user = {
  name: "Ilya",
  surname: "Kantor",
  _version: 1,
  _secret: 123456
};

let proxy = new Proxy(user, {
  enumerate(target) {
    let props = Object.keys(target).filter(function(prop) {
      return prop[0] != '_';
    });

    return props[Symbol.iterator]();
  }
});

*!*
// отфильтрованы свойства, начинающиеся с _
*/!*
for(let prop in proxy) {
  alert(prop); // Выведет свойства user: name, surname
}
```

Посмотрим внимательнее, что происходит внутри `enumerate`:
<ol>
<li>Сначала получаем список интересующих нас свойств в виде массива.</li>
<li>Метод должен возвратить [итератор](/iterator) по массиву. Встроенный итератор для массива получаем через вызов `props[Symbol.iterator]()`.</li>
</ol>


# apply

Прокси умеет работать не только с обычными объектами, но и с функциями.

Если аргумент `target` прокси -- функция, то становится доступна ловушка `apply` для её вызова.

Метод `apply(target, thisArgument, argumentsList)` получает:

<ul>
<li>`target` -- исходный объект.</li>
<li>`thisArgument` -- контекст `this` вызова.</li>
<li>`argumentsList` -- аргументы вызова в виде массива.</li>
</ul>


Она может обработать вызов сама и/или передать его функции.

```js
//+ run
'use strict';

function sum(a, b) {
  return a + b;
}

let proxy = new Proxy(sum, {
*!*
  // передаст вызов в target, предварительно сообщив о нём
*/!*
  apply: function(target, thisArg, argumentsList) {
    alert(`Буду вычислять сумму: ${argumentsList}`);
    return target.apply(thisArg, argumentsList);
  }
});

// Выведет сначала сообщение из прокси,
// а затем уже сумму
alert( proxy(1, 2) );
```

Нечто подобное можно сделать через замыкания. Но прокси может гораздо больше. В том числе и перехватывать вызовы через `new`.

## construct

Ловушка `construct(target, argumentsList)` перехватывает вызовы при помощи `new`.

Она получает исходный объект `target` и список аргументов `argumentsList`.

Пример ниже передаёт операцию создания исходной функции, выводя сообщение об этом:

```js
//+ run
'use strict';

function User(name, surname) {
  this.name = name;
  this.surname = surname;
}

let UserProxy = new Proxy(User, {
*!*
  // передаст вызов new User, предварительно сообщив о нём
*/!*
  construct: function(target, argumentsList) {
    alert(`Запуск new с аргументами: ${argumentsList}`);
    return new target(...argumentsList);
  }
});

let user = new UserProxy("Ilya", "Kantor");

alert( user.name ); // Ilya
```

## Полный список

Полный список возможных функций-перехватчиков, которые может задавать `handler`:

<ul>
<li>[getPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/has) -- перехватывает обращение к методу `getPrototypeOf`.</li>
<li>[setPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/setPrototypeOf) -- перехватывает обращение к методу `setPrototypeOf`.</li>
<li>[isExtensible](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/isExtensible) -- перехватывает обращение к методу `isExtensible`.</li>
<li>[preventExtensions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/preventExtensions) -- перехватывает обращение к методу `preventExtensions`.</li>
<li>[getOwnPropertyDescriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor) -- перехватывает обращение к методу `getOwnPropertyDescriptor`.</li>
<li>[defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/defineProperty) -- перехватывает обращение к методу `defineProperty`.</li>
<li>[has](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/has) -- перехватывает проверку существования свойства, которая используется в операторе `in` и в некоторых других методах встроенных объектов.</li>
<li>[get](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get) -- перехватывает чтение свойства.</li>
<li>[set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set) -- перехватывает запись свойства.</li>
<li>[deleteProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/deleteProperty) -- перехватывает удаление свойства оператором `delete`.</li>
<li>[enumerate](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/enumerate) -- срабатывает при вызове `for..in` или `for..of`, возвращает итератор для свойств объекта.</li>
<li>[ownKeys](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/ownKeys) -- перехватывает обращения к методу `getOwnPropertyNames`.</li>
<li>[apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/apply) -- перехватывает вызовы `target()`.</li>
<li>[construct](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/construct) -- перехватывает вызовы `new target()`.</li>
</ul>

Каждый перехватчик запускается с `handler` в качестве `this`. Это означает, что `handler` кроме ловушек может содержать и другие полезные свойства и методы.

Каждый перехватчик получает в аргументах `target` и дополнительные параметры в зависимости от типа.

Если перехватчик в `handler` не указан, то операция совершается, как если бы была вызвана прямо на `target`.

## Итого

`Proxy` позволяет модифицировать поведение объекта как угодно, перехватывать любые обращения к его свойствам и методам, включая вызовы для функций.

Особенно приятна возможность перехватывать обращения к отсутствующим свойствам, разработчики ожидали её уже давно. 

Что касается поддержки, то возможности полифиллов здесь ограничены. "Переписать" прокси на старом JavaScript сложновато, учитывая низкоуровневые возможности, которые он даёт.

Поэтому нужна именно браузерная поддержка. [Постепенно](https://kangax.github.io/compat-table/es6/) она реализуется.





