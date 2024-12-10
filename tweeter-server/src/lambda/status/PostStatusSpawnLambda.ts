import { FeedStoryDTO } from "../../model/dto/FeedStoryDTO";
import { buildStatusService } from "../helper/factory";
import { queueHandler } from "../helper/QueueHandler";

export const handler = queueHandler(async (feedItemStr: string): Promise<void> => {
  const service = buildStatusService();
  console.log(`Handling spawn status method (${typeof feedItemStr}): ` + feedItemStr);
  // API Gateway doesn't parse this for us.
  const feedItem = JSON.parse(feedItemStr) as FeedStoryDTO;
  return service.postStatusSpawn(feedItem);
});
