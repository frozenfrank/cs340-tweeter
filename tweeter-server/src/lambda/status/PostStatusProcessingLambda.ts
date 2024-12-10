import { buildStatusService } from "../helper/factory";
import { queueHandler } from "../helper/QueueHandler";
import { PostStatusProcessingRequest } from "./PostStatusProcessingRequest";

export const handler = queueHandler(async (requestStr: string): Promise<void> => {
  const service = buildStatusService();
  console.log(`Handling status processing. Raw    (${typeof requestStr}): ` + requestStr);
  // API Gateway does not serialize these items for us.
  const request = JSON.parse(requestStr) as PostStatusProcessingRequest;
  console.log(`Handling status processing. Parsed (${typeof request}): ` + request);
  return service.postStatusProcessing(request.feedItem, request.toFollowerAliases);
});
