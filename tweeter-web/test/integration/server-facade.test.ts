import { PagedData, PagedItemResponse, User } from "tweeter-shared";
import { ServerFacade } from "../../src/model/network/ServerFacade";
import { makeNUsers, makeStatus, makeUser } from "../utils";
import "isomorphic-fetch"

describe('Server Facade', () => {
  let token = "_fake_auth_token_";
  let user = makeUser();

  // CONSIDER: Create a BeforeAll that dynamically fetches/registers a valid user to begin with.

  const server = new ServerFacade();

  // it.each(Array.from({length: 3}).fill(n => "Hello " + (n + 1) + ", 👋") as string[])
  it('should register a new user successfully', async () => {
    const postContent = "Hello, 👋";
    const response = await server.postStatus({
      token, status: makeStatus(postContent)
    });

    expect(response.success).toBe(true);

    // CONSIDER: When the code actually works, fetch the user's story and verify the content exists.
  });

  it('should receive lists of followers, one page at a time', async () => {
    const MAX_ITEMS_RECV = 30;
    let totalCount = 0;
    let batchCount: number;
    let totalBatches = 0;
    let lastItem: User | null = null;

    let sampleUser: User;
    let users: User[];
    let hasMore: boolean;
    do {
      [users, hasMore] = await server.loadMoreFollowers({
        userAlias: user.alias,
        pageSize: 3,
        lastItem,
        token,
      });

      sampleUser = users[0];
      if (sampleUser) {
        // Expect the same fields to be coming over
        expect(Object.keys(sampleUser)).toEqual(Object.keys(user));
      }

      ++totalBatches;
      batchCount = users?.length || 0;
      totalCount += batchCount;
      lastItem = hasMore ? users[users.length - 1] : null;

    } while (hasMore && batchCount > 0 && totalCount < MAX_ITEMS_RECV);

    expect(totalCount).toBeGreaterThan(0);
    expect(totalBatches).toBeGreaterThan(0);
  });

  // it.each(makeNUsers(15))
  it('should get the follower count of a user successfully', async () => {
    const count = await server.getFollowerCount({ token, user });
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
