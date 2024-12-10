import { buildStatusService } from "../helper/factory";
import { queueHandler } from "../helper/QueueHandler";
import { PostStatusProcessingRequest } from "./PostStatusProcessingRequest";

export const handler = queueHandler(async (request: PostStatusProcessingRequest): Promise<void> => {
  const service = buildStatusService();
  return service.postStatusProcessing(request.feedItem, request.toFollowerAliases);
});
