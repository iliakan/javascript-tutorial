importance: 5

---

# Календарь

Создайте календарь.

Конструктор:

```js
var calendar = new Calendar({
  year: 2012, // календарь для года 2012
  month: 2  // месяц - март (нумерация с нуля!)
});
```

События:

- `select` -- при изменении даты.

Публичные методы:

- `setValue(date, quiet)` -- устанавливает дату `date`. Если второй аргумент `true`, то событие не генерируется.
- `getElement()` -- возвращает DOM-элемент для компонента для вставки в документ. При первом вызове создаёт DOM.

Использование -- добавление в документ:

```js
var calendar = new Calendar({... });
calendar.getElement().appendTo('body');
```

Использование -- подписка на изменение и вывод значения:

```js
calendar.on("select", function(e) {
  $('#value').html( e.value+'' );
})
```

Пример в действии:

[iframe border=1 src="solution"]

В исходный документ входит файл `calendar-table.js` со вспомогательными функциями, в частности, `renderCalendarTable(year, month)` генерирует таблицу.

[edit task src="source"].
