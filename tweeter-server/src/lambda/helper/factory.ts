import { FollowService } from "../../model/service/FollowService";
import { StatusService } from "../../model/service/StatusService";
import { UserService } from "../../model/service/UserService";

export const buildFollowService = (): FollowService => {
  return new FollowService();
}

export const buildUserService = (): UserService => {
  return new UserService();
}

export const buildStatusService = (): StatusService => {
  return new StatusService();
}
