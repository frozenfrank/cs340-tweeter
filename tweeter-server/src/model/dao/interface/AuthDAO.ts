import { AuthToken } from "tweeter-shared";

export interface AuthDAO {
  /** Validates the token by inserting it in the DB with an expiration date. */
  insertToken(auth: AuthToken): Promise<void>;

  /** Retrieves an AuthToken from the DB with a token. */
  getToken(token: string): Promise<AuthToken | null>;

  /** Invalidates an auth token by deleting it from the DB. */
  deleteToken(token: string): Promise<void>;
}
