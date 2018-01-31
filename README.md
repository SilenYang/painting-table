# table_console
a library for drawing table in the terminal or console.


# Install

> **npm install --save table_console**

# Import

```js
const TableConsole = require('table_console')

//or

import TableConsole from 'table_console'
```

# Usage

```js
TableConsole(tableData, options)
```
tableData是一个需要展示的数组列表，其中每项为一列数据，例如：
```js
tableData:
[{
    filename: 'banner1.png',
    size: '123B'
},{
    filename: 'banner2.png',
    size: '12KB'
}]
```
options选项为控制每一项需要显示的字段：
```js
options:
{
    filename: true,
    size: true,
}
```
经过处理后会在terminal或控制台打印出结果

![TableConsole](./table.jpg)

# LICENSE

MIT