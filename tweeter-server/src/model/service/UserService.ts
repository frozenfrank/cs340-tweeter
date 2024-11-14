import { FakeData, User, UserDTO } from "tweeter-shared";

export class UserService {

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBase64: string,
    imageFileExtension: string
  ): Promise<SignedInUser> {

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return this.returnSignedInUser(user);
  };


  public async logout(token: string): Promise<void> {
    // TODO: Implement method
  };

  public async login(alias: string, password: string): Promise<SignedInUser> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return this.returnSignedInUser(user);
  };

  private async returnSignedInUser(user: User): Promise<SignedInUser> {
    const token = FakeData.instance.authToken.token;
    return [user.dto, token];
  }


  public async getUser(token: string, alias: string): Promise<UserDTO | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias)?.dto || null;
  };
}
