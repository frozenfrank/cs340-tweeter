import { TweeterResponse } from "tweeter-shared";
import { FeedStoryDTO } from "../../model/dto/FeedStoryDTO";
import { buildStatusService } from "../helper/factory";
import { successfulEmptyResponse } from "../helper/helper";

export const handler = async (feedItem: FeedStoryDTO): Promise<TweeterResponse> => {
  const service = buildStatusService();
  await service.postStatusSpawn(feedItem);
  return successfulEmptyResponse();
};
