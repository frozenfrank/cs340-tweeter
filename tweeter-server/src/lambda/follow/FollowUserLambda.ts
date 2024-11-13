import { UserRequestSingle, ValueResponse } from "tweeter-shared";
import { FollowBidirectionalCount } from "../../model/service/FollowService";
import { buildFollowService } from "../helper/factory";
import { packageValueResponse } from "../helper/helper";

export const handler = async (request: UserRequestSingle): Promise<ValueResponse<FollowBidirectionalCount>> => {
  const followService = buildFollowService();
  const result = await followService.follow(request.token, request.user);
  return packageValueResponse(result);
};
