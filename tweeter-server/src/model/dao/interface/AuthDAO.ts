export interface AuthDAO {
  /** Invalidates an auth token by deleting it from the DB. */
  deleteToken(token: string): Promise<void>;
}
