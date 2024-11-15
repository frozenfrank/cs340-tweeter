import "isomorphic-fetch";
import { ServerFacade } from "../../src/model/network/ServerFacade";
import { StatusService } from "../../src/model/service/StatusService";
import { makeAuthToken, makeUser } from "../utils";

describe('Status Service', () => {
  let user = makeUser();

  // CONSIDER: Create a BeforeAll that dynamically fetches/registers a valid user to begin with.

  const server = new ServerFacade();
  const service = new StatusService(server);

  it('should return the statuses for a user', async () => {
    const token = makeAuthToken();
    const [statuses, hasMore] = await service.loadMoreStoryItems(token, user.alias, 10, null);
    expect(statuses.length).toBeGreaterThan(0);
    expect(typeof hasMore).toBe('boolean');
  });
});
