import PermissionWrapper from "@/components/PermissionWrapper"

function Page() {
  return (
    <div>
      <PermissionWrapper requiredPermissions={{actions: "job:sysJob:edit"}}>
        <button>Role</button>
      </PermissionWrapper>
      <div>啊啊啊啊</div>
    </div>
    // <div>Hello</div>
  )
}

export default Page
