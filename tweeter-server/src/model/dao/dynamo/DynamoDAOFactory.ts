import { AuthDAO } from "../interface/AuthDAO";
import { DAOFactory } from "../interface/DAOFactory";
import { FollowDAO } from "../interface/FollowDAO";
import { ImageDAO } from "../interface/ImageDAO";
import { StatusDAO } from "../interface/StatusDAO";
import { UserDAO } from "../interface/UserDAO";
import { DynamoAuthDAO } from "./DynamoAuthDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoStatusDAO } from "./DynamoStatusDAO";
import { DynamoUserDAO } from "./DynamoUserDAO";

export class DynamoDaoFactory implements DAOFactory {
  // Lazy load these so they are only constructed when needed.
  // These are using a lightweight singleton pattern.
  private auth?: AuthDAO;
  private image?: ImageDAO;
  private user?: UserDAO;
  private follow?: FollowDAO;
  private status?: StatusDAO;


  getAuthDao(): AuthDAO {
    this.auth ||= new DynamoAuthDAO();
    return this.auth;
  }
  getFollowDao(): FollowDAO {
    this.follow ||= new DynamoFollowDAO(this.getUserDao());
    return this.follow;
  }
  getImageDao(): ImageDAO {
    throw new Error("Method not implemented.");
  }
  getStatusDao(): StatusDAO {
    this.status ||= new DynamoStatusDAO(this.getFollowDao());
    return this.status;
  }
  getUserDao(): UserDAO {
    this.user ||= new DynamoUserDAO();
    return this.user;
  }

}
