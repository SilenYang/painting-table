const chalk = require('chalk')

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

// header
const draw_head = (showField) => {
    let headStr = '',
        headerUpStr = '',
        headerDownStr = '',
        headerContentStr = ''

    showField.forEach((item, index) => {
        headerUpStr += `${Repeat_Text(' ─', item.min_width / 2 + 2)}${index === showField.length - 1 ? '' : ' ┬'}`
        headerDownStr += `${Repeat_Text(' ─', item.min_width / 2 + 2)}${index === showField.length - 1 ? '' : ' ┼'}`
        headerContentStr += `  ${Color_Text(Repair_text(item.title, item.min_width),'green')}  ${index === showField.length - 1 ? '' : ' |'}`
    })

    headStr += `  ┌${headerUpStr} ┐\n  |${headerContentStr} |\n  ├${headerDownStr} ┤\n`

    return headStr
}

// body
const draw_body = (data, showField) => {
    let bodyStr = '',
        bottomStr = ''
    data.forEach((item, index) => {
        bodyStr += `  |`
        showField.forEach((field, idx) => {
            index === 0 && (bottomStr += `${Repeat_Text(' ─', field.min_width / 2 + 2)}${idx === showField.length - 1 ? '' : ' ┴'}`)

            bodyStr += `  ${Repair_text(item[field.title], field.min_width)}   |${idx === showField.length - 1 ? '\n' : ''}`
        })
        bodyStr += index !== data.length - 1 ? '' : `  └${bottomStr} ┘`
    })
    return bodyStr
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
    tableStr += draw_head(showField)
    tableStr += draw_body(data, showField)
    console.log(tableStr)
}