import { AuthToken, User } from "tweeter-shared";
import { UserInfo } from "../../components/userInfo/UserInfoProvider";
import { UserService } from "../../model/service/UserService";
import { LoadingPresenter, LoadingView } from "../Presenter";

export interface AuthenticationView extends LoadingView {
  updateUserInfo: UserInfo["updateUserInfo"];
  navigate(url: string): void;
}

export class AuthenticationPresenter<V extends AuthenticationView> extends LoadingPresenter<V, UserService> {
  override buildService() { return new UserService(this.server); }

  protected doAuthentication(
    doAuthenticate: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    navigationUrl: string,
    actionName: string,
  ) {
    return this.doTryOperation(async () => {
      const [user, authToken] = await doAuthenticate();
      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(navigationUrl);
    }, actionName);
  }
}
