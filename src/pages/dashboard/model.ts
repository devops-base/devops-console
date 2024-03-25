import type { FormList } from "#/form"

// 搜索数据
export const searchList: FormList[] = [
  {
    label: '日期',
    name: 'pay_date',
    component: 'RangePicker',
    componentProps: {
      allowClear: false,
    }
  },
  {
    label: '全服充值',
    name: 'all_pay',
    wrapperCol: 15,
    component: 'Checkbox'
  }
]
