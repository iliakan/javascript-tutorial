importance: 5

---

# Свойство функции после bind

В свойство функции записано значение. Изменится ли оно после применения `bind`? Обоснуйте ответ.

```js
function sayHi() {
  alert( this.name );
}
sayHi.test = 5;
alert( sayHi.test ); // 5

*!*
var bound = sayHi.bind({
  name: "Вася"
});

alert( bound.test ); // что выведет? почему?
*/!*
```

