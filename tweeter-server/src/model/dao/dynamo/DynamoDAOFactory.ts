import { AuthDAO } from "../interface/AuthDAO";
import { DAOFactory } from "../interface/DAOFactory";
import { FollowDAO } from "../interface/FollowDAO";
import { ImageDAO } from "../interface/ImageDAO";
import { StatusDAO } from "../interface/StatusDAO";
import { UserDAO } from "../interface/UserDAO";
import { DynamoAuthDAO } from "./DynamoAuthDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { S3ImageDao } from "./S3ImageDAO";
import { DynamoStatusDAO } from "./DynamoStatusDAO";
import { DynamoUserDAO } from "./DynamoUserDAO";
import { SqsClient } from "../sqs/SqsClient";

export class DynamoDaoFactory implements DAOFactory {
  // Lazy load these so they are only constructed when needed.
  // These are using a lightweight singleton pattern.
  private auth?: AuthDAO;
  private image?: ImageDAO;
  private user?: UserDAO;
  private follow?: FollowDAO;
  private status?: StatusDAO;

  private readonly AWS_ACCT_ID = "043309350193";
  private readonly SQS_REGION = "us-west-2";
  private readonly QUEUE_BASE = `https://sqs.${this.SQS_REGION}.amazonaws.com/${this.AWS_ACCT_ID}/`;

  getAuthDao(): AuthDAO {
    this.auth ||= new DynamoAuthDAO();
    return this.auth;
  }
  getFollowDao(): FollowDAO {
    this.follow ||= new DynamoFollowDAO(this.getUserDao());
    return this.follow;
  }
  getImageDao(): ImageDAO {
    this.image ||= new S3ImageDao();
    return this.image;
  }
  getStatusDao(): StatusDAO {
    if (!this.status) {
      const postQueue           = new SqsClient(this.SQS_REGION, this.QUEUE_BASE + "tweeter-post-queue");
      const postProcessingQueue = new SqsClient(this.SQS_REGION, this.QUEUE_BASE + "tweeter-post-status-processing-queue");
      this.status = new DynamoStatusDAO(this.getFollowDao(), postQueue, postProcessingQueue);
    }
    return this.status;
  }
  getUserDao(): UserDAO {
    this.user ||= new DynamoUserDAO();
    return this.user;
  }

}
