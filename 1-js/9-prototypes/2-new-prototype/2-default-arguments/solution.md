Можно прототипно унаследовать от `options` и добавлять/менять опции в наследнике:

```js run
var originalOptions = {
  width: 100,
  height: 200
};

function Menu(options) {
  options = Object.create(options);
  options.width = 300;

  alert("width: " + options.width); // возьмёт width из наследника
  alert("height: " + options.height); // возьмёт height из исходного объекта
}

var menu = new Menu(originalOptions);

alert("original width: " + originalOptions.width); // width исходного объекта
alert("original height: " + originalOptions.height); // height исходного объекта
```

Все изменения будут происходить не в самом `options`, а в его наследнике, при этом исходный объект останется незатронутым.
