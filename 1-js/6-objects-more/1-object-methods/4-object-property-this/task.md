importance: 5

---

# Значение this в объявлении объекта

Что выведет `alert` в этом коде? Почему?

```js
var firstName = "";

var user = {
  firstName: "Василий",

  export: this
};

alert( user.export.firstName );
```

