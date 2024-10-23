import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView {
  originalUrl: string | undefined;
}

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
  public isLoginDisabled(alias: string, password: string): boolean {
    return !alias || !password;
  };

  public async doLogin(alias: string, password: string, rememberMe: boolean) {
    return this.doAuthentication(
      () => this.service.login(alias, password),
      rememberMe,
      !!this.view.originalUrl ? this.view.originalUrl : "/",
      "log user in"
    );
  };

}
