import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const followService = new FollowService();
};
