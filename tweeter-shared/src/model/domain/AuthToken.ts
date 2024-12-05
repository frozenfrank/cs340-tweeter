import { v4 as uuid } from "uuid";
export class AuthToken {
  private _token: string;
  private _timestamp: number;
  private _alias: string;

  public static Generate(alias: string): AuthToken {
    const token: string = AuthToken.generateToken();
    const timestamp: number = Date.now();
    return new AuthToken(token, timestamp, alias);
  }

  private static generateToken(): string {
    try {
      return uuid().toString();
    } catch (error) {
      // UUID not available. Generating a random string. Making it 64 characters to reduce the liklihood of a duplicate
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$^*()-+";
      const charactersLength = characters.length;
      for (let i = 0; i < 64; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    }
  }

  public constructor(token: string, timestamp: number, alias: string) {
    this._token = token;
    this._timestamp = timestamp;
    this._alias = alias;
  }

  public get token(): string {
    return this._token;
  }

  public set token(value: string) {
    this._token = value;
  }

  public get timestamp(): number {
    return this._timestamp;
  }

  public set timestamp(value: number) {
    this._timestamp = value;
  }

  public get alias(): string {
    return this._alias;
  }

  public set alias(value: string) {
    this._alias = value;
  }

  public static fromJson(json: string | null | undefined): AuthToken | null {
    if (!!json) {
      const jsonObject: { _token: string; _timestamp: number; _alias: string; } =
        JSON.parse(json);
      return new AuthToken(jsonObject._token, jsonObject._timestamp, jsonObject._alias);
    } else {
      return null;
    }
  }

  public toJson(): string {
    return JSON.stringify(this);
  }
}
