import { compareSync, hashSync } from "bcryptjs";
import { UserDTO } from "tweeter-shared";
import { ImageDAO } from "../dao/interface/ImageDAO";
import { UserDAO } from "../dao/interface/UserDAO";
import { AuthService } from "./AuthService";

type SignedInUser = [UserDTO, token: string];

export class UserService {

  private readonly HASHING_ROUNDS = 8;

  constructor(
    private authService: AuthService,
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

    const profileImgUrl = await this.imageDao.uploadProfileImage(userImageBase64, imageFileExtension, alias);
    if (!profileImgUrl) {
      throw new Error("Profile image did not upload");
    }

    const hashedPassword = hashSync(password, this.HASHING_ROUNDS);

    const user = await this.userDao.register(firstName, lastName, alias, hashedPassword, profileImgUrl);
    if (!user) {
      throw new Error("Invalid registration");
    }

    return this.returnSignedInUser(user);
  };


  public logout(token: string): Promise<void> {
    return this.authService.invalidateToken(token);
  };

  public async login(alias: string, password: string): Promise<SignedInUser> {
    const user = await this.userDao.getByAlias(alias);
    if (!user || !compareSync(password, user.passwordHash)) {
      throw new Error("Invalid alias or password");
    }

    return this.returnSignedInUser(user);
  };

  private async returnSignedInUser(user: UserDTO): Promise<SignedInUser> {
    const token = await this.authService.generateToken(user.alias);
    return [user, token];
  }


  public async getUser(token: string, alias: string): Promise<UserDTO | null> {
    await this.authService.assertToken(token);
    return this.userDao.getByAlias(alias);
  };
}
