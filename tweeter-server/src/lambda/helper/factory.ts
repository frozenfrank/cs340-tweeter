import { DynamoDaoFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { DAOFactory } from "../../model/dao/interface/DAOFactory";
import { AuthService } from "../../model/service/AuthService";
import { FollowService } from "../../model/service/FollowService";
import { StatusService } from "../../model/service/StatusService";
import { UserService } from "../../model/service/UserService";

// This is the single place where we choose a particular DAO family implementation.
const daoFactory: DAOFactory = new DynamoDaoFactory();

const authService = new AuthService(daoFactory.getAuthDao())

let follow: FollowService;
let user: UserService;
let status: StatusService;

export const buildFollowService = (): FollowService => {
  follow ??= new FollowService(authService, daoFactory.getFollowDao());
  return follow;
}

export const buildUserService = (): UserService => {
  user ??= new UserService(authService, daoFactory.getImageDao(), daoFactory.getUserDao());
  return user;
}

export const buildStatusService = (): StatusService => {
  status ??= new StatusService(authService, daoFactory.getStatusDao());
  return status;
}
