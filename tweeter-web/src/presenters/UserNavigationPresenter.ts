import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { ServicePresenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  setDisplayedUser(user: User): void;
}

export class UserNavigationPresenter extends ServicePresenter<UserNavigationView, UserService> {
  override buildService() { return new UserService(); }

  public async navigateToUser(authToken: AuthToken, currentUser: User, rawAlias: string) {
    return this.doTryOperation(async () => {
      const alias = this.extractAlias(rawAlias);

      const user = await this.service.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    }, "get user");
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  };
}
