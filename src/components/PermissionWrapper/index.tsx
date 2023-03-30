import authentication, {AuthParams} from "@/utils/authentication"
import React, {useEffect, useState} from "react"
import {useSelector} from "react-redux"
import {RootState} from "@/stores"
// import Forbidden from "@/pages/403"

type PermissionWrapperProps = AuthParams & {
  backup?: React.ReactNode;
};

function PermissionWrapper(props: React.PropsWithChildren<PermissionWrapperProps>) {
  const {requiredPermissions, oneOfPerm} = props;
  const [hasPermission, setHasPermission] = useState(false);
  const userInfo = useSelector((state: RootState) => state.user.userInfo)

  useEffect(() => {
    const hasPermission = authentication(
      { requiredPermissions, oneOfPerm },
      userInfo.permissions
    );
    setHasPermission(hasPermission);
  }, [requiredPermissions, oneOfPerm, userInfo.permissions]);
  if (hasPermission) {
    return <div className={`min-w-980px h-full p-10px box-border overflow-auto`}>
      <div className={`relative box-border px-5`} >
        {convertReactElement(props.children)}
      </div>
    </div>
  } else {
    return <span></span>; //
  }
}

function convertReactElement(node: React.ReactNode): React.ReactNode {
  if (!React.isValidElement(node)) {
    return <>{node}</>
  }
  return node;
}

export default PermissionWrapper;
