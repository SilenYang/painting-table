# painting-table
a library for painting a table in terminal or browser console.


# Install

> **npm install --save painting-table**

# Import

```js
const Table = require('painting-table')

//or

import Table from 'painting-table'
```

# Usage

```js
Table(tableData, options)
```

tableData是一个需要展示的数组列表，其中每项为一列数据，例如：
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
经过处理后会在terminal或浏览器控制台打印出结果:

### Terminal
![Terminal](./images/terminal_table.jpg)

### Browser Console
![Browser Console](./images/console_table.jpg)

# LICENSE

MIT