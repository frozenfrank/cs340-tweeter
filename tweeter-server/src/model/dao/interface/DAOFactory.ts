import { AuthDAO } from "./AuthDAO";
import { FollowDAO } from "./FollowDAO";
import { ImageDAO } from "./ImageDAO";
import { StatusDAO } from "./StatusDAO";
import { UserDAO } from "./UserDAO";

export interface DAOFactory {
  getAuthDao(): AuthDAO;
  getFollowDao(): FollowDAO;
  getImageDao(): ImageDAO;
  getStatusDao(): StatusDAO;
  getUserDao(): UserDAO;
}
