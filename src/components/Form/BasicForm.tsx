import type { ReactNode, Ref } from 'react';
import type { FormData, FormList } from '#/form';
import type { ColProps, FormItemProps } from 'antd';
import { useEffect, useImperativeHandle } from 'react';
import { FormProps } from 'antd';
import { Form } from 'antd';
import { getComponent } from '../Form/utils/componentMap';
import { handleValuePropName } from './utils/helper';
import { filterDayjs } from '../Dates/utils/helper';

export interface FormFn {
  getFieldValue: (key: string) => unknown;
  getFieldsValue: () => FormData;
  handleReset: () => void;
  handleSubmit: () => void;
}

interface Props {
  list: FormList[];
  data: FormData;
  children?: ReactNode;
  labelCol?: Partial<ColProps>;
  wrapperCol?: Partial<ColProps>;
  formRef?: Ref<FormFn>;
  handleFinish: FormProps['onFinish'];
}

function BasicForm(props: Props) {
  const {
    list,
    data,
    children,
    labelCol,
    wrapperCol,
    formRef,
    handleFinish
  } = props;
  const [form] = Form.useForm();

  // 抛出外部方法
  useImperativeHandle(
    formRef,
    () => ({
      /**
       * 获取表单值
       * @param key - 表单唯一值
       */
      getFieldValue: (key: string) => {
        return form.getFieldValue(key) || {};
      },
      /** 获取表单全部值 */
      getFieldsValue: () => {
        return form.getFieldsValue() || {};
      },
      /** 重置表单 */
      handleReset: () => {
        form.resetFields();
      },
      /** 提交表单  */
      handleSubmit: () => {
        form.submit();
      }
    } as FormFn)
  );

  // 监听传入表单数据，如果变化则替换表单
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(props.data);
  }, [form, props.data]);

  const validateMessages = {
    required: '${label}为必填项',
    types: {
      email: '${label}不是邮箱格式!',
      number: '${label}不是数字格式!',
    },
    number: {
      range: '${label}必须大于${min}且小于${max}',
    },
  };

  /**
   * 提交表单
   * @param values - 表单值
   */
  const onFinish: FormProps['onFinish'] = values => {
    if (handleFinish) {
      // 将dayjs类型转为字符串
      const params = filterDayjs(values, list);
      handleFinish?.(params);
    }
  };

  /**
   * 表单提交失败处理
   * @param errorInfo - 错误信息
   */
  const onFinishFailed: FormProps['onFinishFailed'] = errorInfo => {
    console.warn('表单错误:', errorInfo);
  };

  return (
    <div>
      <Form
        form={form}
        labelCol={labelCol ? labelCol : { span: 6 }}
        wrapperCol={wrapperCol ? wrapperCol : { span: 15 }}
        initialValues={data}
        validateMessages={validateMessages}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {
          list?.map((item) => {
            const params = { ...item };
            delete params.componentProps;
            return (
              <Form.Item
                {...params as FormItemProps}
                key={`${item.name}`}
                label={item.label}
                name={item.name}
                rules={!item.hidden ? item.rules : []}
                className={item.hidden ? '!hidden' : ''}
                valuePropName={handleValuePropName(item.component)}
              >
                { getComponent(item) }
              </Form.Item>
            );
          })
        }

        { children }
      </Form>
    </div>
  );
}

export default BasicForm;
