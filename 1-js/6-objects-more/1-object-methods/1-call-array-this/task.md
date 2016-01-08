importance: 5

---

# Вызов в контексте массива

Каким будет результат? Почему?

```js
var arr = ["a", "b"];

arr.push(function() {
  alert( this );
})

arr[2](); // ?
```

