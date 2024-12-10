import { FeedStoryDTO } from "../../model/dto/FeedStoryDTO";
import { buildStatusService } from "../helper/factory";
import { queueHandler } from "../helper/QueueHandler";

export const handler = queueHandler(async (feedItem: FeedStoryDTO): Promise<void> => {
  const service = buildStatusService();
  console.log(`Handling spawn status method: ` + JSON.stringify(feedItem));
  return service.postStatusSpawn(feedItem);
});
