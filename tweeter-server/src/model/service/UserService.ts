import { FakeData, User, UserDTO } from "tweeter-shared";
import { ImageDAO } from "../dao/interface/ImageDAO";
import { UserDAO } from "../dao/interface/UserDAO";

type SignedInUser = [UserDTO, token: string];

export class UserService {

  constructor(
    private userDao: UserDAO,
    private imageDao: ImageDAO,
  ) { }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBase64: string,
    imageFileExtension: string
  ): Promise<SignedInUser> {

    const profileImgUrl = await this.imageDao.uploadProfileImage(userImageBase64, imageFileExtension);
    if (!profileImgUrl) {
      throw new Error("Profile image did not upload");
    }

    const hashedPassword = password; // TODO: Install and hash with bcrypt
    if (hashedPassword === password) {
      console.warn("😈 You haven't yet hashed the password, my friend.")
    }

    const user = await this.userDao.register(firstName, lastName, alias, hashedPassword, profileImgUrl);
    if (!user) {
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
