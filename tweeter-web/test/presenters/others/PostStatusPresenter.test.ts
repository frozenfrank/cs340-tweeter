import { anyNumber, capture, verify } from "ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import { StatusService } from "../../../src/model/service/StatusService";
import { PostStatusPresenter, PostStatusView } from "../../../src/presenters/others/PostStatusPresenter";
import { mockServicePresenter } from "../../utils";

describe('PostStatusPresenter', () => {
  let mockPostStatusPresenterView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;

  const authToken = new AuthToken("_fake_auth_token", Date.now());
  const currentUser = new User("Donald", "Duck", "@donald_duck", "s3://donald_duck.jpg");
  const postContent = "This is my fun post content 🦆";

  beforeEach(() => {
    ({
      mockPresenterView: mockPostStatusPresenterView,
      mockStatusService: mockStatusService,
      presenterInstance: postStatusPresenter,
    } = mockServicePresenter<PostStatusView, StatusService, PostStatusPresenter>(v => new PostStatusPresenter(v)));
  });

  it('tells the view to display a posting status message', async () => {
    await postStatusPresenter.doPostStatus(authToken, currentUser, postContent);
    verify(mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0)).once() ;
  });

  it('calls postStatus on the post status service with the correct status string and auth token', async () => {
    await postStatusPresenter.doPostStatus(authToken, currentUser, postContent);

    const [capturedAuthToken, capturedStatus] = capture(mockStatusService.postStatus).last();
    expect(capturedAuthToken).toEqual(authToken);
    expect(capturedStatus.user).toEqual(currentUser);
    expect(capturedStatus.post).toEqual(postContent);
  });

  it('On success, tells the view to clear the last info message, clear the post, and display a status posted message', async () => {
    await postStatusPresenter.doPostStatus(authToken, currentUser, postContent);

    verify(mockPostStatusPresenterView.clearLastInfoMessage()).once();
    verify(mockPostStatusPresenterView.setPost("")).once();
    verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", anyNumber())).once();
  });

  it('On failure, tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message', async () => {

  });
});
