Результат выполнения может быть разный: `innerHTML` вставит именно HTML, а `createTextNode` интерпретирует теги как текст.

Запустите следующие примеры, чтобы увидеть разницу:

- `createTextNode` создает текст <code>'&lt;b&gt;текст&lt;/b&gt;'</code>:

    ```html run height=50
    <div id="elem"></div>
    <script>
      var text = '<b>текст</b>';

      elem.appendChild(document.createTextNode(text));
    </script>
    ```
- `innerHTML` присваивает HTML <code>&lt;b&gt;текст&lt;/b&gt;</code>:

    ```html run height=50
    <div id="elem"></div>
    <script>
      var text = '<b>текст</b>';

      elem.innerHTML = text;
    </script>
    ```

