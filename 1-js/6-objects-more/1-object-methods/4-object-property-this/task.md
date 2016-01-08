importance: 5

---

# Значение this в объявлении объекта

Что выведет `alert` в этом коде? Почему?

```js
var name = "";

var user = {
  name: "Василий",

  export: this
};

alert( user.export.name );
```

