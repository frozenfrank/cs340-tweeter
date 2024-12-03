import { AuthToken } from "tweeter-shared";
import { AuthDAO } from "../interface/AuthDAO";
import { DynamoDAO } from "./DynamoDAO";

// TODO: Convert this into a common DTO object
interface AuthTokenEntity {
  token: string;
  timestamp: number;
  alias: string;
}

export class DynamoAuthDAO extends DynamoDAO<AuthTokenEntity, AuthToken> implements AuthDAO {
  protected tableName = 'tweeter-auth';

  private tokenAttr = 'token';
  private timestampAttr = 'timestamp';
  private aliasAttr = 'alias';


  insertToken(auth: AuthToken): Promise<void> {
    return this.putItem({
      token: auth.token,
      timestamp: auth.timestamp,
      alias: auth.alias,
    }).then();
  }
  getToken(token: string): Promise<AuthToken | null> {
    return this.getItem(this.generateKey(token));
  }
  deleteToken(token: string): Promise<void> {
    return this.deleteItem(this.generateKey(token));
  }

  protected override readItem(data: Record<string, any>): AuthToken {
    return new AuthToken(data[this.tokenAttr], data[this.timestampAttr], data[this.aliasAttr]);
  }

  private generateKey(token: string) {
    return { [this.tokenAttr]: token };
  }

}
