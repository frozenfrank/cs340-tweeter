import { FakeData, UserDTO } from "tweeter-shared";
import { AuthDAO } from "../dao/interface/AuthDAO";
import { ImageDAO } from "../dao/interface/ImageDAO";
import { UserDAO } from "../dao/interface/UserDAO";

type SignedInUser = [UserDTO, token: string];

export class UserService {

  constructor(
    private authDao: AuthDAO,
    private imageDao: ImageDAO,
    private userDao: UserDAO,
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


  public logout(token: string): Promise<void> {
    return this.authDao.deleteToken(token);
  };

  public async login(alias: string, password: string): Promise<SignedInUser> {
    const INVALID_CREDS_MSG = "Invalid alias or password";

    const user = await this.userDao.getByAlias(alias);
    if (user === null) {
      throw new Error(INVALID_CREDS_MSG);
    }

    console.warn("😈 Don't forget to compare password hashes to each other!")
    if (user.passwordHash !== password) {
      throw new Error(INVALID_CREDS_MSG);
    }

    return this.returnSignedInUser(user);
  };

  private async returnSignedInUser(user: UserDTO): Promise<SignedInUser> {
    const token = FakeData.instance.authToken.token;
    return [user, token];
  }


  public async getUser(token: string, alias: string): Promise<UserDTO | null> {
    return this.userDao.getByAlias(alias);
  };
}
