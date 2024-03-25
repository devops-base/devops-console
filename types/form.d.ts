import type {
  InputProps,
  InputNumberProps,
  SelectProps,
  TreeSelectProps,
  RadioProps,
  DatePickerProps,
  TimePickerProps,
  UploadProps,
  RateProps,
  CheckboxProps,
  SliderSingleProps,
  TimeRangePickerProps,
  TransferProps,
  FormItemProps
} from "antd"
import type {Key, ReactElement, ReactNode} from "react"
import type { IAllDataType } from './public'
import type { RangePickerProps } from 'antd/lib/date-picker'
import type { DefaultOptionType } from 'antd/lib/select'
import type { RuleObject } from 'antd/lib/form'
import type { IBusinessComponents } from '@/components/Business'
import type { IEditorProps } from '@/components/WangEditor'
import {TextAreaProps} from "antd/es/input"
import {ITreeProps} from "@/components/Tree/BasicTree"
import {ServerResult} from "@/servers/request/types"

// 数据类型
export type IFormData = Record<string, IAllDataType>

// 基础数据组件
type IDefaultDataComponents = 'Input' |
                              'InputNumber' |
                              'Textarea' |
                              'InputPassword' |
                              'AutoComplete' |
                              'customize'

// 下拉组件
type ISelectComponents = 'Select' | 'TreeSelect' | 'ApiSelect' | 'ApiTreeSelect'

// 复选框组件
type ICheckboxComponents = 'Checkbox' | 'CheckboxGroup'

// 单选框组件
type IRadioComponents = 'RadioGroup' | 'Switch'

// 时间组件
type ITimeComponents = 'DatePicker' | 'RangePicker' | 'TimePicker' | 'TimeRangePicker'

// 上传组件
type IUploadComponents = 'Upload'

// 星级组件
type IRateComponents = 'Rate'

// 穿梭俊组件
type ITransfer = 'Transfer'

// 搜索数
type ITreeComponents  = 'Tree'

// 滑动输入条组件
type ISliderComponents = 'Slider'

// 自定义组件
type ICustomizeComponents = 'Customize'

// 富文本编辑器
type IEditorComponents = 'Editor'

// 密码强度组件
type IPasswordStrength = 'PasswordStrength'

// 组件集合
export type ComponentType = IDefaultDataComponents |
                          ISelectComponents |
                          ICheckboxComponents |
                          ITimeComponents |
                          IRadioComponents |
                          ICustomizeComponents |
                          IUploadComponents |
                          IRateComponents |
                          ISliderComponents |
                          IEditorComponents |
                          IPasswordStrength |
                          TimeRangePickerProps |
                          RangePickerProps |
                          ITransfer |
                          ITreeComponents |
                          IBusinessComponents

export interface IApiResult extends Omit<DefaultOptionType, 'value'> {
  label: ReactNode;
  title?: ReactNode;
  key?: Key;
  value?: string | number;
}

export type ApiFn = (params?: object) => Promise<ServerResult<unknown>>

// api参数
interface ApiParam {
  api?: ApiFn;
  params?: object;
}

// 组件参数
export type IComponentProps = InputProps |
                              InputNumberProps |
                              SelectProps |
                              TreeSelectProps |
                              CheckboxProps |
                              RadioProps |
                              DatePickerProps |
                              TimePickerProps |
                              UploadProps |
                              RateProps |
                              TextAreaProps |
                              TimeRangePickerProps |
                              TransferProps |
                              RangePickerProps |
                              SliderSingleProps |
                              IApiSelectProps |
                              IApiTreeSelectProps |
                              ITreeProps |
                              IEditorProps

// 表单规则
export type FormRule = RuleObject & {
  trigger?: 'blur' | 'change' | ['change', 'blur'];
}

// 表单数据
export type IFormList = {
  name: string | string[]; // 表单域字段
  label: string; // 标签
  placeholder?: string; // 占位符
  hidden?: boolean; // 是否隐藏
  rules?: FormRule[]; // 规则
  labelCol?: number; // label宽度
  wrapperCol?: number; // 内容宽度
  component: IComponentType; // 组件
  componentProps?: IComponentProps; // 组件参数
  render?: ReactElement; // 自定义渲染
}

export type SelectObjectStr = Record<string, string>

export type FormData = Record<string, unknown>

// 组件参数
export type ComponentProps =  InputProps |
                              InputNumberProps |
                              SelectProps |
                              TreeSelectProps |
                              CheckboxProps |
                              RadioProps |
                              DatePickerProps |
                              TimePickerProps |
                              UploadProps |
                              RateProps |
                              TextAreaProps |
                              TimeRangePickerProps |
                              TransferProps |
                              RangePickerProps |
                              SliderSingleProps |
                              IApiSelectProps |
                              IApiTreeSelectProps |
                              ITreeProps |
                              IEditorProps

// 表单数据
export interface FormList extends FormItemProps {
  name: string | string[]; // 表单域字段
  label: string; // 标签
  placeholder?: string; // 占位符
  hidden?: boolean; // 是否隐藏
  unit?: string; // 单位
  rules?: IFormRule[]; // 规则
  labelCol?: number; // label宽度
  wrapperCol?: number; // 内容宽度
  component: ComponentType; // 组件
  componentProps?: ComponentProps; // 组件参数
  render?: ReactElement; // 自定义渲染
}
