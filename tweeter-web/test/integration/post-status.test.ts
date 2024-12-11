import { anyNumber, verify } from "ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../../src/model/network/ServerFacade";
import { PostStatusPresenter, PostStatusView } from "../../src/presenters/others/PostStatusPresenter";
import "isomorphic-fetch"

describe('Post Status Integration', () => {
  const server = new ServerFacade();

  it('should login a user, post a status, and see a confirmation, and find status in story', async () => {

    // Login
    const signedInRsp = await server.loginUser({
      alias: "@integration_test",
      password: "85yDVKmvwurJVV6",
    });
    expect(signedInRsp).toBeTruthy();

    const {token, user} = signedInRsp;
    expect(token).toBeTruthy();
    expect(user).toBeTruthy();
    const signedInUser = User.fromDto(user)!;
    const auth = new AuthToken(token, +new Date, signedInUser.alias);


    // Create presenter
    const view: PostStatusView = {
      setPost: jest.fn(),
      setIsLoading: jest.fn(),
      displayErrorMessage: jest.fn(),
      clearLastInfoMessage: jest.fn(),
      displayInfoMessage: jest.fn(),
    };
    const presenter = new PostStatusPresenter(view);


    // Post a status
    const statusContent = "Hello, world! " + "🚀".repeat(Math.random() * 15 + 1);
    const postStart = new Date;
    await presenter.doPostStatus(auth, signedInUser, statusContent);
    const postEnd = new Date;
    const postSecs = (+postEnd - +postStart) / 1000;
    console.log(`Posting status took ${postSecs} seconds.`);
    expect(postSecs).toBeLessThanOrEqual(2);

    verify(view.displayErrorMessage).never();
    verify(view.clearLastInfoMessage).never();
    verify(view.setIsLoading).twice();
    verify(view.displayInfoMessage("Status posted!", anyNumber())).once(); // Verify success message displayed without error message


    // Verify status found in story
    const loadStart = new Date;
    const [storyItems, _hasMoreStory] = await server.loadMoreStoryItems({
      userAlias: user.alias,
      pageSize: 1,
      lastItem: null,
      token,
    });
    const loadEnd = new Date;
    const loadSecs = (+loadEnd - +loadStart) / 1000;
    console.log(`Loading feed took ${loadSecs} seconds.`);
    expect(loadSecs).toBeLessThanOrEqual(2);

    expect(storyItems).toHaveLength(1);
    expect(storyItems[0].post).toBe(statusContent);
  });
});
