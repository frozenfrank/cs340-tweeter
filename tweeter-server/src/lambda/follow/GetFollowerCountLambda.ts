import { UserRequestSingle, ValueResponse } from "tweeter-shared";
import { buildFollowService } from "../helper/factory";
import { packageValueResponse } from "../helper/helper";

export const handler = async (request: UserRequestSingle): Promise<ValueResponse<number>> => {
  const service = buildFollowService();
  const result = await service.getFollowerCount(request.token, request.user);
  return packageValueResponse(result);
};
