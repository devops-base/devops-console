// 时间参数

import {Tag} from "antd"

export const dateFormat = (dateStr: string | Date, formatter: string = 'yyyy-MM-dd hh:mm:ss') =>  {
  let date = dateStr
  if (typeof date === 'string') {
    date = new Date(dateStr)
  }

  let ptr = {
    'M+': date.getMonth() +1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(),  // 小时
    'm+': date.getMinutes(),  // 分钟
    's+': date.getSeconds(),  // 秒
    'q+': Math.floor((date.getMonth() +3)/3), //季度
    S: date.getMilliseconds(), //毫秒
  }
  if (/(y+)/.test(formatter)) {
    formatter = formatter.replace(RegExp.$1,(date.getFullYear() + '').substr(4- RegExp.$1.length),)
  }
  for (const [k, v] of Object.entries(ptr)) {
    if (new RegExp('(' + k + ')').test(formatter)) {
      formatter = formatter.replace(RegExp.$1, RegExp.$1.length === 1 ? '' + v : ('00' +v).substr((''+v).length))
    }
  }
  return formatter
}

export function valueToColorJSX (value: string): JSX.Element {
  if (value !== '1') {
    return <Tag className={`text-lg`} color={'success'}>显示</Tag>
  }
  return <Tag className={`text-lg`} color={'error'}>隐藏</Tag>
}
