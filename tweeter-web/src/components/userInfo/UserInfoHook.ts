import { useContext } from "react";
import { UserInfo, UserInfoContext } from "./UserInfoProvider";

const useUserInfo = (): UserInfo => {
  return useContext(UserInfoContext);
};

export default useUserInfo;
