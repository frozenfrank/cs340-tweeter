import { Buffer } from "buffer";
import { AuthToken, SignedInUserResponse, User } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

type SignedInUser = [User, AuthToken];

export class UserService {

  constructor(private server: ServerFacade) { }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<SignedInUser> {
    const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");
    const response = await this.server.registerUser({
      firstName, lastName,
      alias, password,
      userImageBase64: imageStringBase64,
      imageFileExtension,
    });

    return this.extractSignedInUser(response);
  };

  public async login(alias: string, password: string): Promise<SignedInUser> {
    const response = await this.server.loginUser({
      alias, password
    });
    return this.extractSignedInUser(response);
  };

  private extractSignedInUser(response: SignedInUserResponse): SignedInUser {
    const user = User.fromDto(response.user) as User;
    const authToken = new AuthToken(response.token, +new Date);
    return [user, authToken];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    await this.server.logoutUser({token: authToken.token});
  };

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.server.getUser({
      token: authToken.token, alias
    });
  };
}
