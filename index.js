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
     *   三种 border 的位置：top/center/bottom
     */
    getBorderLine(type) {
        if (this.borders[`${type}Line`]) return this.borders[`${type}Line`]
        this.borders[`${type}Line`] = `  ${config[this.env][type].l}`
        this.showField.forEach((item, index) => {
            this.borders[`${type}Line`] += `${Repeat_Text(' ' + config[this.env][type].h, item.width / 2 + 2)}${index === this.showField.length - 1 ? '' : ' ' + config[this.env][type].c}`
        })
        this.borders[`${type}Line`] += ` ${config[this.env][type].r}\n`
        return this.borders[`${type}Line`]
    }

    // 数据行
    getRow(row) {
        let rowStr = `  ${config[this.env]['center'].v}`
        this.showField.forEach((item, index) => {
            rowStr += `  ${row ? Repair_text(row[item.originTitle], item.width) : Color_Text(Repair_text(item.title, item.width), 'green')}   ${config[this.env]['center'].v}${index === this.showField.length - 1 ? '\n' : ''}`
        })
        return rowStr
    }

    getHeader() {
        let headerStr = ''
        headerStr += this.getBorderLine('top') + this.getRow() + this.getBorderLine('center')
        return headerStr
    }
}

class Options {
    constructor(data, options) {
        this.excludes = options.excludes || []
        this.includes = options.includes || []
        this.rename = options.rename || {}
        this.data = data
    }

    notEmpty(obj) {
        if (obj instanceof Array) return obj.length
        else return Object.keys(obj).length
    }

    getFields() {
        let fields = []
            // 生成配置数组
        this.data.forEach(field => {
            for (let key in field) {
                fields.some(item => item.originTitle === key) ?
                    (fields = fields.map(item => {
                        if (item.originTitle === key) {
                            const len = Field_length(field[item.originTitle])
                            item.width = item.width >= len ? item.width : len % 2 ? len + 1 : len
                        }
                        return item
                    })) :
                    fields.push({
                        title: this.rename[key] || key,
                        originTitle: key,
                        width: Field_length(field[key] || this.rename[key] || key)
                    })
            }
        })

        // 按配置项进行筛选
        if (this.notEmpty(this.includes)) {
            switch (this.includes.constructor) {
                case Array:
                    fields = fields.filter(filed => this.includes.includes(filed.originTitle))
                    break
                case Object:
                    fields = fields.filter(filed => this.includes[filed.originTitle])
                    break
                default:
                    break
            }
        } else if (!this.notEmpty(this.includes) && this.notEmpty(this.excludes)) {
            switch (this.excludes.constructor) {
                case Array:
                    fields = fields.filter(filed => !this.excludes.includes(filed.originTitle))
                    break
                case Object:
                    fields = fields.filter(filed => !this.excludes[filed.originTitle])
                    break
                default:
                    break
            }
        }

        return fields
    }
}

module.exports = (data, options) => {
    const showField = new Options(data, options).getFields()
    const table = new Table(showField)

    let tableStr = table.getHeader()
    data.forEach((item, index) => {
        tableStr += table.getRow(item)
        tableStr += index === data.length - 1 ? table.getBorderLine('bottom') : table.getBorderLine('center')
    })

    return tableStr
}