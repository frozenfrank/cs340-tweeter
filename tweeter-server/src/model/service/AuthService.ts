import { AuthToken } from "tweeter-shared";
import { AuthDAO } from "../dao/interface/AuthDAO";

export class AuthService {

  private readonly TOKEN_VALIDITY_DAYS = 14;

  constructor(
    private authDao: AuthDAO,
  ) { }

  public async generateToken(): Promise<string> {
    const auth = AuthToken.Generate();
    await this.authDao.insertToken(auth);
    return auth.token;
  }

  public async assertToken(token: string): Promise<void|never> {
    if (!await this.verifyToken(token)){
      throw new Error("Invalid token");
    }
  }

  public async verifyToken(token: string): Promise<boolean> {
    // Verify token existence
    const auth = await this.authDao.getToken(token);
    if (!auth) return false;

    // Verify recent generation
    const minAcceptableThreshold = +new Date - this.TOKEN_VALIDITY_DAYS * 24 * 60 * 60 * 1000;
    if (auth.timestamp < minAcceptableThreshold) return false;

    // Valid
    return true;
  }

  public async invalidateToken(token: string): Promise<void> {
    this.authDao.deleteToken(token);
  }
}
