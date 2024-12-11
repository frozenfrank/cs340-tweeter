import { buildStatusService } from "../helper/factory";
import { queueHandler } from "../helper/QueueHandler";
import { PostStatusProcessingRequest } from "./PostStatusProcessingRequest";

export const handler = queueHandler((requestStr: string): Promise<void> => {
  const service = buildStatusService();
  // API Gateway does not serialize these items for us.
  const request = JSON.parse(requestStr) as PostStatusProcessingRequest;
  return service.postStatusProcessing(request.feedItem, request.toFollowerAliases);
});
