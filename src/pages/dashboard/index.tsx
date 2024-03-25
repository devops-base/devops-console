import { useTitle } from '@/hooks/useTitle'
import BasicContent from '@/components/Content/BasicContent'

function Dashboard() {
  useTitle('数据展览')

  return (
    <BasicContent isPermission={true}>
      <>
        <div>
          Home
        </div>
      </>
    </BasicContent>
  )
}

export default Dashboard
