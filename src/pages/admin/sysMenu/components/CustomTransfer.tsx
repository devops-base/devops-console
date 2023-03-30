import {Transfer, TransferProps} from 'antd'
import {IConstant} from "@/utils/constants"

/**
 * 自定义穿梭框
 */

function CustomizeTransfer(option: TransferProps<IConstant>) {
  const filterOption = (inputValue: string, option: IConstant) =>
    option.label?.indexOf(inputValue) > -1;

  return (
    <>
      <Transfer
        {...option}
        rowKey={(item) => item.id as unknown as string}
        titles={['未授权', '已授权']}
        filterOption={filterOption}
        render={(item) => item.label}
        showSearch={true}
      />
    </>
  )
}

export default CustomizeTransfer
