import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { buildStatusService } from "../helper/factory";
import { successfulEmptyResponse } from "../helper/helper";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
  const service = buildStatusService();
  await service.postStatus(request.token, request.status);
  return successfulEmptyResponse();
};
