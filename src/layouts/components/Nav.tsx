import type { RootState } from '@/stores'
import {Breadcrumb, BreadcrumbProps} from 'antd'
import { useSelector } from 'react-redux'
import {NavData} from "@/menus/utils/helper"


interface IProps {
  className?: string;
  list: NavData[];
}

function Nav(props: IProps) {
  const { className, list } = props

  // 是否手机端
  const isPhone = useSelector((state: RootState) => state.menu.isPhone)

  const handleList = (list: NavData[]) => {
    const result: BreadcrumbProps['items'] = [];
    if (!list?.length) return [];

    for (let i = 0; i < list?.length; i++) {
      const item = list?.[i];
      const data =  item.labelZh;
      result.push({
        title: data || ''
      });
    }

    return result;
  };

  return (
    <>
      {
        !isPhone &&
        <div className={`${className} flex items-center`}>
          <Breadcrumb
            items={handleList(list)}
          />
        </div>
      }
    </>
  )
}

export default Nav
