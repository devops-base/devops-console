import {Key, useState} from 'react'
import { Tree } from 'antd'
import {TreeProps} from "antd/lib"

// @ts-ignore
export interface ITreeProps extends TreeProps {
  selectKeys: Key[];
  onCheck: TreeProps['onCheck'];
}

function BasicTree(props: ITreeProps) {
  const { selectKeys } = props
  const [defaultKeys, setDefaultKeys] = useState(selectKeys || [])

  /**
   * 更改数据
   * @param selectedKeys - 显示在右侧框数据的key集合
   * @param info
   */
  const onCheck: TreeProps['onCheck'] = (selectedKeys, info) => {
    // @ts-ignore
    setDefaultKeys(selectedKeys)
    props?.onCheck?.(selectedKeys,info)
  };
  return (
    <Tree
      {...props}
      defaultExpandedKeys={defaultKeys}
      defaultCheckedKeys={defaultKeys}
      defaultSelectedKeys={defaultKeys}
      checkable={true}
      onCheck={onCheck}
    />
  )
}

export default BasicTree
