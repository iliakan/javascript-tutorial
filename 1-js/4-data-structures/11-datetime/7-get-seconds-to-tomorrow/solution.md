Для получения оставшихся до конца дня миллисекунд нужно из "завтра 00 ч 00 мин 00 сек" вычесть текущее время.

Чтобы сгенерировать "завтра" -- увеличим текущую дату на 1 день:

```js run
function getSecondsToTomorrow() {
  var now = new Date();

  // создать объект из завтрашней даты, без часов-минут-секунд
  var tomorrow = new Date(now.getFullYear(), now.getMonth(), *!*now.getDate()+1*/!*);

  var diff = tomorrow - now; // разница в миллисекундах
  return Math.round(diff / 1000); // перевести в секунды
}
```

