importance: 5

---

# Запись в объект после bind

Что выведет функция?

```js
function f() {
  alert( this );
}

var user = {
  g: f.bind("Hello")
}

user.g();
```

