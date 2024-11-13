import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { buildFollowService } from "../helper/factory";
import { packageResponse } from "../helper/helper";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const followService = buildFollowService();
  const [userDTO, hasMore] = await followService.loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem);
  return packageResponse({
    items: userDTO,
    hasMore,
  });
};
