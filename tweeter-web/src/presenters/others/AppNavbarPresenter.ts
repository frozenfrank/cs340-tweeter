import { AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { MessageView, ServicePresenter } from "../Presenter";

export interface AppNavbarView extends MessageView {
  clearUserInfo(): void;
}

export class AppNavbarPresenter extends ServicePresenter<AppNavbarView, UserService> {
  override buildService() { return new UserService(); }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    return this.doTryOperation(async () => {
      await this.service.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  };
}
