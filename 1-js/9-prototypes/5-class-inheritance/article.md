# Наследование классов в JavaScript

Наследование на уровне объектов в JavaScript, как мы видели, реализуется через ссылку `__proto__`.

Теперь поговорим о наследовании на уровне классов, то есть когда объекты, создаваемые, к примеру, через `new Admin`, должны иметь все методы, которые есть у объектов, создаваемых через `new User`, и ещё какие-то свои.

[cut]

## Наследование Array от Object

Для реализации наследования в наших классах мы будем использовать тот же подход, который принят внутри JavaScript.

Взглянем на него ещё раз на примере `Array`, который наследует от `Object`:

![](class-inheritance-array-object.png)

- Методы массивов `Array` хранятся в `Array.prototype`.
- `Array.prototype` имеет прототипом `Object.prototype`.

Поэтому когда экземпляры класса `Array` хотят получить метод массива -- они берут его из своего прототипа, например `Array.prototype.slice`.

Если же нужен метод объекта, например, `hasOwnProperty`, то его в `Array.prototype` нет, и он берётся из `Object.prototype`.

Отличный способ "потрогать это руками" -- запустить в консоли команду `console.dir([1,2,3])`.

Вывод в Chrome будет примерно таким:

![](console_dir_array.png)

Здесь отчётливо видно, что сами данные и `length` находятся в массиве, дальше в `__proto__` идут методы для массивов `concat`, то есть `Array.prototype`, а далее -- `Object.prototype`.

```smart header="`console.dir` для доступа к свойствам"
Обратите внимание, я использовал именно `console.dir`, а не `console.log`, поскольку `log` зачастую выводит объект в виде строки, без доступа к свойствам.
```

## Наследование в наших классах

Применим тот же подход для наших классов: объявим класс `Rabbit`, который будет наследовать от `Animal`.

Вначале создадим два этих класса по отдельности, они пока что будут совершенно независимы.

`Animal`:

```js
function Animal(name) {
  this.name = name;
  this.speed = 0;
}

Animal.prototype.run = function(speed) {
  this.speed += speed;
  alert( this.name + ' бежит, скорость ' + this.speed );
};

Animal.prototype.stop = function() {
  this.speed = 0;
  alert( this.name + ' стоит' );
};
```

`Rabbit`:

```js
function Rabbit(name) {
  this.name = name;
  this.speed = 0;
}

Rabbit.prototype.jump = function() {
  this.speed++;
  alert( this.name + ' прыгает' );
};

var rabbit = new Rabbit('Кроль');
```

Для того, чтобы наследование работало, объект `rabbit = new Rabbit` должен использовать свойства и методы из своего прототипа `Rabbit.prototype`, а если их там нет, то -- свойства и метода родителя, которые хранятся в `Animal.prototype`.

Если ещё короче -- порядок поиска свойств и методов должен быть таким: `rabbit -> Rabbit.prototype -> Animal.prototype`, по аналогии с тем, как это сделано для объектов и массивов.

Для этого можно поставить ссылку `__proto__` с `Rabbit.prototype` на `Animal.prototype`.

Можно сделать это так:
```js
Rabbit.prototype.__proto__ = Animal.prototype;
```

Однако, прямой доступ к `__proto__` не поддерживается в IE10-, поэтому для поддержки этих браузеров мы используем функцию `Object.create`. Она либо встроена либо легко [эмулируется](https://learn.javascript.ru/new-prototype#inherit) во всех браузерах.

Класс `Animal` остаётся без изменений, а `Rabbit.prototype` мы будем создавать с нужным прототипом, используя `Object.create`:

```js no-beautify
function Rabbit(name) {
  this.name = name;
  this.speed = 0;
}

*!*
// задаём наследование
Rabbit.prototype = Object.create(Animal.prototype);
*/!*

// и добавим свой метод (или методы...)
Rabbit.prototype.jump = function() { ... };
```

Теперь выглядеть иерархия будет так:

![](class-inheritance-rabbit-animal.png)

В `prototype` по умолчанию всегда находится свойство `constructor`, указывающее на функцию-конструктор. В частности, `Rabbit.prototype.constructor == Rabbit`. Если мы рассчитываем использовать это свойство, то при замене `prototype` через `Object.create` нужно его явно сохранить:

```js
Rabbit.prototype = Object.create(Animal.prototype);
Rabbit.prototype.constructor = Rabbit;
```

## Полный код наследования

Для наглядности -- вот итоговый код с двумя классами `Animal` и `Rabbit`:

```js
// 1. Конструктор Animal
function Animal(name) {
  this.name = name;
  this.speed = 0;
}

// 1.1. Методы -- в прототип

Animal.prototype.stop = function() {
  this.speed = 0;
  alert( this.name + ' стоит' );
}

Animal.prototype.run = function(speed) {
  this.speed += speed;
  alert( this.name + ' бежит, скорость ' + this.speed );
};

// 2. Конструктор Rabbit
function Rabbit(name) {
  this.name = name;
  this.speed = 0;
}

// 2.1. Наследование
Rabbit.prototype = Object.create(Animal.prototype);
Rabbit.prototype.constructor = Rabbit;

// 2.2. Методы Rabbit
Rabbit.prototype.jump = function() {
  this.speed++;
  alert( this.name + ' прыгает, скорость ' + this.speed );
}
```

Как видно, наследование задаётся всего одной строчкой, поставленной в правильном месте.

Обратим внимание: `Rabbit.prototype = Object.create(Animal.prototype)` присваивается сразу после объявления конструктора, иначе он перезатрёт уже записанные в прототип методы.

````warn header="Неправильный вариант: `Rabbit.prototype = new Animal`"
В некоторых устаревших руководствах предлагают вместо `Object.create(Animal.prototype)` записывать в прототип `new Animal`, вот так:

```js
// вместо Rabbit.prototype = Object.create(Animal.prototype)
Rabbit.prototype = new Animal();
```

Частично, он рабочий, поскольку иерархия прототипов будет такая же, ведь `new Animal` -- это объект с прототипом `Animal.prototype`, как и `Object.create(Animal.prototype)`. Они в этом плане идентичны.

Но у этого подхода важный недостаток. Как правило мы не хотим создавать `Animal`, а хотим только унаследовать его методы!

Более того, на практике создание объекта может требовать обязательных аргументов, влиять на страницу в браузере, делать запросы к серверу и что-то ещё, чего мы хотели бы избежать. Поэтому рекомендуется использовать вариант с `Object.create`.
````

## Вызов конструктора родителя

Посмотрим внимательно на конструкторы `Animal` и `Rabbit` из примеров выше:

```js
function Animal(name) {
  this.name = name;
  this.speed = 0;
}

function Rabbit(name) {
  this.name = name;
  this.speed = 0;
}
```

Как видно, объект `Rabbit` не добавляет никакой особенной логики при создании, которой не было в `Animal`.

Чтобы упростить поддержку кода, имеет смысл не дублировать код конструктора `Animal`, а напрямую вызвать его:

```js
function Rabbit(name) {
  Animal.apply(this, arguments);
}
```

Такой вызов запустит функцию `Animal` в контексте текущего объекта, со всеми аргументами, она выполнится и запишет в `this` всё, что нужно.

Здесь можно было бы использовать и `Animal.call(this, name)`, но `apply` надёжнее, так как работает с любым количеством аргументов.

## Переопределение метода

Итак, `Rabbit` наследует `Animal`. Теперь если какого-то метода нет в `Rabbit.prototype` -- он будет взят из `Animal.prototype`.

В `Rabbit` может понадобиться задать какие-то методы, которые у родителя уже есть. Например, кролики бегают не так, как остальные животные, поэтому переопределим метод `run()`:

```js
Rabbit.prototype.run = function(speed) {
  this.speed++;
  this.jump();
};
```

Вызов `rabbit.run()` теперь будет брать `run` из своего прототипа:

![](class-inheritance-rabbit-run-animal.png)

### Вызов метода родителя внутри своего

Более частая ситуация -- когда мы хотим не просто заменить метод на свой, а взять метод родителя и расширить его. Скажем, кролик бежит так же, как и другие звери, но время от времени подпрыгивает.

Для вызова метода родителя можно обратиться к нему напрямую, взяв из прототипа:

```js
 Rabbit.prototype.run = function() {
*!*
   // вызвать метод родителя, передав ему текущие аргументы
   Animal.prototype.run.apply(this, arguments);
*/!*
   this.jump();
 }
```

Обратите внимание на вызов через `apply` и явное указание контекста.

Если вызвать просто `Animal.prototype.run()`, то в качестве `this` функция `run` получит `Animal.prototype`, а это неверно, нужен текущий объект.

## Итого

- Для наследования нужно, чтобы "склад методов потомка" (`Child.prototype`) наследовал от "склада метода родителей" (`Parent.prototype`).

    Это можно сделать при помощи `Object.create`:

    Код:

    ```js
    Rabbit.prototype = Object.create(Animal.prototype);
    ```
- Для того, чтобы наследник создавался так же, как и родитель, он вызывает конструктор родителя в своём контексте, используя `apply(this, arguments)`, вот так:

    ```js
    function Rabbit(...) {
      Animal.apply(this, arguments);
    }
    ```
- При переопределении метода родителя в потомке, к исходному методу можно обратиться, взяв его напрямую из прототипа:

    ```js
    Rabbit.prototype.run = function() {
      var result = Animal.prototype.run.apply(this, ...);
      // result -- результат вызова метода родителя
    }
    ```

Структура наследования полностью:

```js run
*!*
// --------- Класс-Родитель ------------
*/!*
// Конструктор родителя пишет свойства конкретного объекта
function Animal(name) {
  this.name = name;
  this.speed = 0;
}

// Методы хранятся в прототипе
Animal.prototype.run = function() {
  alert(this.name + " бежит!")
}

*!*
// --------- Класс-потомок -----------
*/!*
// Конструктор потомка
function Rabbit(name) {
  Animal.apply(this, arguments);
}

// Унаследовать
*!*
Rabbit.prototype = Object.create(Animal.prototype);
*/!*

// Желательно и constructor сохранить
Rabbit.prototype.constructor = Rabbit;

// Методы потомка
Rabbit.prototype.run = function() {
  // Вызов метода родителя внутри своего
  Animal.prototype.run.apply(this);
  alert( this.name + " подпрыгивает!" );
};

// Готово, можно создавать объекты
var rabbit = new Rabbit('Кроль');
rabbit.run();
```

Такое наследование лучше функционального стиля, так как не дублирует методы в каждом объекте.

Кроме того, есть ещё неявное, но очень важное архитектурное отличие.

Зачастую вызов конструктора имеет какие-то побочные эффекты, например влияет на документ. Если конструктор родителя имеет какое-то поведение, которое нужно переопределить в потомке, то в функциональном стиле это невозможно.

Иначе говоря, в функциональном стиле в процессе создания `Rabbit` нужно обязательно вызывать `Animal.apply(this, arguments)`, чтобы получить методы родителя -- и если этот `Animal.apply` кроме добавления методов говорит: "Му-у-у!", то это проблема:

```js
function Animal() {
  this.walk = function() {
    alert('walk')
  };
  alert( 'Му-у-у!' );
}

function Rabbit() {
  Animal.apply(this, arguments); // как избавиться от мычания, но получить walk?
}
```

...Которой нет в прототипном подходе, потому что в процессе создания `new Rabbit` мы вовсе не обязаны вызывать конструктор родителя. Ведь методы находятся в прототипе.

Поэтому прототипный подход стоит предпочитать функциональному как более быстрый и универсальный. А что касается красоты синтаксиса -- она сильно лучше в новом стандарте ES6, которым можно пользоваться уже сейчас, если взять транслятор [babeljs](https://babeljs.io/).

