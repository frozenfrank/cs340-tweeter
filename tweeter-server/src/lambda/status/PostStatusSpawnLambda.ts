import { FeedStoryDTO } from "../../model/dto/FeedStoryDTO";
import { buildStatusService } from "../helper/factory";
import { queueHandler } from "../helper/QueueHandler";

export const handler = queueHandler((feedItemStr: string): Promise<void> => {
  const service = buildStatusService();
  // API Gateway doesn't parse this for us.
  const feedItem = JSON.parse(feedItemStr) as FeedStoryDTO;
  return service.postStatusSpawn(feedItem);
});
