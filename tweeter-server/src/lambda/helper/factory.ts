import { DynamoDaoFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { DAOFactory } from "../../model/dao/interface/DAOFactory";
import { AuthService } from "../../model/service/AuthService";
import { FollowService } from "../../model/service/FollowService";
import { StatusService } from "../../model/service/StatusService";
import { UserService } from "../../model/service/UserService";

// This is the single place where we choose a particular DAO family implementation.
const daoFactory: DAOFactory = new DynamoDaoFactory();

const authService = new AuthService(daoFactory.getAuthDao())

export const buildFollowService = (): FollowService => {
  return new FollowService(authService, daoFactory.getFollowDao());
}

export const buildUserService = (): UserService => {
  return new UserService(authService, daoFactory.getImageDao(), daoFactory.getUserDao());
}

export const buildStatusService = (): StatusService => {
  return new StatusService(authService, daoFactory.getStatusDao());
}
