import { User } from "tweeter-shared";

export interface UserDAO {
  /** Registers the user and returns the resulting user. */
  register(
    firstName: string,
    lastName: string,
    alias: string,
    hashedPassword: string,
    imageUrl: string
  ): Promise<User>;
}
