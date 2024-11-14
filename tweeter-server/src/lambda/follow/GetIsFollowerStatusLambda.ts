import { UserRequestDouble, ValueResponse } from "tweeter-shared";
import { buildFollowService } from "../helper/factory";
import { packageValueResponse } from "../helper/helper";

export const handler = async (request: UserRequestDouble): Promise<ValueResponse<boolean>> => {
  const service = buildFollowService();
  const result = await service.getIsFollowerStatus(request.token, request.user, request.user2);
  return packageValueResponse(result);
};
