import { UserDTO } from "tweeter-shared";

export interface UserDAO {
  /** Registers the user and returns the resulting user. */
  register(
    firstName: string,
    lastName: string,
    alias: string,
    hashedPassword: string,
    imageUrl: string
  ): Promise<UserDTO>;

  /** Gets a user by their Alias. */
  getByAlias(alias: string): Promise<UserDTO|null>;
}
