# Методы для работы с DOM [в работе]

jQuery-коллекции предоставляют полный набор методов для DOM-манипуляций. И кое-что сверху...

[cut]

## Классы и стили

- addClass, hasClass, removeClass

attr
prop
css

Таблица методов:

.append(parent)
: Вставить последним потомком `parent`

.prepend(parent)
: Вставить первым потомком `parent`

.insertAfter(sibling)
: Вставить сразу после элемента `sibling`

.insertBefore(sibling)
: Вставить сразу перед элементом `sibling`

.remove()
: Удалить элемент из DOM, удалить связанные с ним данные и обработчики событий.

.detach()
: Удалить элемент из DOM, не удаляя связанные с ним данные и обработчики.

.empty()
: Удалить всех потомков вызовом remove

Зеркальные методы:

- append -> appendTo
- prepend -> prependTo
- insertAfter -> after
- insertBefore -> before

