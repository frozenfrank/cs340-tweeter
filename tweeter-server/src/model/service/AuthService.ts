import { AuthToken } from "tweeter-shared";
import { AuthDAO } from "../dao/interface/AuthDAO";

export class AuthService {

  private readonly TOKEN_VALIDITY_DAYS = 14;

  constructor(
    private authDao: AuthDAO,
  ) { }

  public async generateToken(alias: string): Promise<string> {
    const auth = AuthToken.Generate(alias);
    await this.authDao.insertToken(auth);
    return auth.token;
  }

  public async assertToken(token: string): Promise<AuthToken|never> {
    const auth = await this.authDao.getToken(token);
    if (!auth || !this.verifyAuth(auth)){
      throw new Error("Invalid authorization");
    }
    return auth;
  }

  public verifyAuth(auth: AuthToken|null): boolean {
    // Verify token existence
    if (!auth) return false;

    // Verify recent generation
    const minAcceptableThreshold = +new Date - this.TOKEN_VALIDITY_DAYS * 24 * 60 * 60 * 1000;
    if (auth.timestamp < minAcceptableThreshold) return false;

    // Valid
    return true;
  }

  public invalidateToken(token: string): Promise<void> {
    return this.authDao.deleteToken(token);
  }
}
