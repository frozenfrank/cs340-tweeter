import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  setDisplayedUser(user: User): void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private userService = new UserService();

  public async navigateToUser(authToken: AuthToken, currentUser: User, rawAlias: string) {
    return this.doTryOperation(async () => {
      const alias = this.extractAlias(rawAlias);

      const user = await this.userService.getUser(authToken!, alias);

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
