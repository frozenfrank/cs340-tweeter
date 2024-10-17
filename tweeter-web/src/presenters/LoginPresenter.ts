import { UserInfo } from "../components/userInfo/UserInfoProvider";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
  originalUrl: string | undefined;
  setIsLoading(isLoading: boolean): void;
  updateUserInfo: UserInfo["updateUserInfo"];
  navigate(url: string): void;
}

export class LoginPresenter extends Presenter<LoginView> {
  private userService = new UserService();

  public checkSubmitButtonStatus(alias: string, password: string): boolean {
    return !alias || !password;
  };

  public async doLogin(alias: string, password: string, rememberMe: boolean) {
    await this.doTryOperation(async () => {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.userService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!this.view.originalUrl) {
        this.view.navigate(this.view.originalUrl);
      } else {
        this.view.navigate("/");
      }
    }, "log user in");
    this.view.setIsLoading(false);
  };

}
