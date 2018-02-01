const chalk = require('chalk')
const config = require('./config')

const Color_Text = (text, color = 'red') => chalk[color](text)

const Repeat_Text = (text, length) => text.repeat(length)

const Repair_text = (text, length) => {
    // 检测双字节字符
    let doubleNum = text ? text.toString().match(/[^ -~]/g) : 0
    doubleNum = Array.isArray(doubleNum) ? doubleNum.length : doubleNum
    return text.toString().padEnd(length - doubleNum, ' ')
}

const Field_length = (field) => {
    const len = field.toString().replace(/[^\x00-\xff]/g, '01').length
    return len % 2 ? len + 1 : len
}

class Table {
    constructor(showField) {
        this.env = typeof window === "undefined" ? 'global' : 'window';
        this.showField = showField
        this.borders = {
            topLine: '',
            centerLine: '',
            bottomLine: '',
        }
    }

    /* 
     *   type: the position of border
     *       top/center/bottom
     */
    getBorderLine(type) {
        if (this.borders[`${type}Line`]) return this.borders[`${type}Line`]
        this.borders[`${type}Line`] = `  ${config[this.env][type].l}`
        this.showField.forEach((item, index) => {
            this.borders[`${type}Line`] += `${Repeat_Text(' ' + config[this.env][type].h, item.min_width / 2 + 2)}${index === this.showField.length - 1 ? '' : ' ' + config[this.env][type].c}`
        })
        this.borders[`${type}Line`] += ` ${config[this.env][type].r}\n`
        return this.borders[`${type}Line`]
    }

    // data rows
    getRow(row) {
        let rowStr = `  ${config[this.env]['center'].v}`
        this.showField.forEach((item, index) => {
            rowStr += `  ${Repair_text(row ? row[item.title] : item.title, item.min_width)}   ${config[this.env]['center'].v}${index === this.showField.length - 1 ? '\n' : ''}`
        })
        return rowStr
    }

    getHeader() {
        let headerStr = ''
        headerStr += this.getBorderLine('top') + this.getRow() + this.getBorderLine('center')
        return headerStr
    }
}

module.exports = (data, options) => {
    // 获取显示字段
    const showField = []
    for (let field in options) options[field] && showField.push({
        title: field,
        min_width: Field_length(field)
    })

    // 获取字段宽度
    showField.forEach(field => {
        data.forEach(item => {
            const len = Field_length(item[field.title])
            field.min_width = field.min_width >= len ? field.min_width : len % 2 ? len + 1 : len
        })
    })

    let tableStr = ''
    const table = new Table(showField)

    tableStr += table.getHeader()
    data.forEach((item, index) => {
        tableStr += table.getRow(item)
        tableStr += index === data.length - 1 ? table.getBorderLine('bottom') : table.getBorderLine('center')
    })
    console.log(tableStr)
}