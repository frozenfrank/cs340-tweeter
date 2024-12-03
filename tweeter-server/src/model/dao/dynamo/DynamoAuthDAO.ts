import { AuthToken } from "tweeter-shared";
import { AuthDAO } from "../interface/AuthDAO";
import { DynamoDAO } from "./DynamoDAO";

export class DynamoAuthDAO extends DynamoDAO implements AuthDAO {
  insertToken(auth: AuthToken): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getToken(token: string): Promise<AuthToken | null> {
    throw new Error("Method not implemented.");
  }
  deleteToken(token: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

}
