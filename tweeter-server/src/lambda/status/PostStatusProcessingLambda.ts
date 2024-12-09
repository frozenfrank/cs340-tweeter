import { TweeterResponse } from "tweeter-shared";
import { buildStatusService } from "../helper/factory";
import { successfulEmptyResponse } from "../helper/helper";
import { PostStatusProcessingRequest } from "./PostStatusProcessingRequest";

export const handler = async (request: PostStatusProcessingRequest): Promise<TweeterResponse> => {
  const service = buildStatusService();
  await service.postStatusProcessing(request.feedItem, request.toFollowerAliases);
  return successfulEmptyResponse();
};
