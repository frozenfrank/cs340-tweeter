import { UserInfo } from "../components/userInfo/UserInfoProvider";
import { UserService } from "../model/service/UserService";

export interface LoginView {
  originalUrl: string | undefined;
  setIsLoading(isLoading: boolean): void;
  updateUserInfo: UserInfo["updateUserInfo"];
  displayErrorMessage(message: string): void;
  navigate(url: string): void;
}

export class LoginPresenter {
  private alias = "";
  private password = "";
  private rememberMe = false;

  private userService = new UserService();

  constructor(
    private view: LoginView,
  ) { }

  public checkSubmitButtonStatus (): boolean {
    return !this.alias || !this.password;
  };

  public async doLogin () {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.userService.login(this.alias, this.password);

      this.view.updateUserInfo(user, user, authToken, this.rememberMe);

      if (!!this.view.originalUrl) {
        this.view.navigate(this.view.originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to log user in because of exception: ${error}`);
    } finally {
      this.view.setIsLoading(false);
    }
  };

  public setAlias(newVal: string): void {
    this.alias = newVal;
  }
  public setPassword(newVal: string): void {
    this.password = newVal;
  }
  public setRememberMe(newVal: boolean): void {
    this.rememberMe = newVal;
  }
}
