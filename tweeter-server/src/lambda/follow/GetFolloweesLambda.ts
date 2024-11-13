import { PagedItemResponse, PagedItemRequest, UserDTO } from "tweeter-shared";
import { buildFollowService } from "../helper/factory";
import { packageResponse } from "../helper/helper";

export const handler = async (request: PagedItemRequest<UserDTO>): Promise<PagedItemResponse<UserDTO>> => {
  const followService = buildFollowService();
  const [userDTO, hasMore] = await followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);
  return packageResponse({
    items: userDTO,
    hasMore,
  });
};
