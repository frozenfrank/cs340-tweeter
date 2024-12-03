import { User } from "tweeter-shared";
import { DAO } from "./DAO";

export interface UserDAO extends DAO {
  /** Registers the user and returns the resulting user. */
  register(
    firstName: string,
    lastName: string,
    alias: string,
    hashedPassword: string,
    imageUrl: string
  ): Promise<User>;
}
