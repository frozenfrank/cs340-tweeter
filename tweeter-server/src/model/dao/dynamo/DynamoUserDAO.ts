import { UserDTO } from "tweeter-shared";
import { UserDAO } from "../interface/UserDAO";
import { DynamoTableDAO } from "./DynamoDAO";

export class DynamoUserDAO extends DynamoTableDAO<UserDTO> implements UserDAO {
  protected tableName = 'tweeter-users';

  private aliasAttr = "alias";
  protected override keyAttr = this.aliasAttr;

  register(
    firstName: string,
    lastName: string,
    alias: string,
    hashedPassword: string,
    imageUrl: string,
  ): Promise<UserDTO> {
    const userDTO: UserDTO = {
      firstName, lastName, alias,
      imageUrl, passwordHash: hashedPassword,
    };
    return this.putItem(userDTO).then(_ => userDTO);
  }

  getByAlias(alias: string): Promise<UserDTO | null> {
    return this.getItem(this.generateDefaultKey(alias));
  }

}
