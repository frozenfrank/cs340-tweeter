import { anyNumber, anyString, anything, capture, verify, when } from "ts-mockito";
import { StatusService } from "../../../src/model/service/StatusService";
import { PostStatusPresenter, PostStatusView } from "../../../src/presenters/others/PostStatusPresenter";
import { makeAuthToken, makeUser, mockServicePresenter } from "../../utils";

describe('PostStatusPresenter', () => {
  let mockPostStatusPresenterView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;

  const authToken = makeAuthToken();
  const currentUser = makeUser();
  const postContent = "This is my fun post content 🦆";

  const STATUS_POSTING_MESSAGE = "Posting status...";
  const STATUS_POSTED_MESSAGE = "Status posted!";

  beforeEach(() => {
    ({
      mockPresenterView: mockPostStatusPresenterView,
      mockStatusService: mockStatusService,
      presenterInstance: postStatusPresenter,
    } = mockServicePresenter<PostStatusView, StatusService, PostStatusPresenter>(v => new PostStatusPresenter(v)));
  });

  it('tells the view to display a posting status message', async () => {
    await postStatusPresenter.doPostStatus(authToken, currentUser, postContent);
    verify(mockPostStatusPresenterView.displayInfoMessage(STATUS_POSTING_MESSAGE, 0)).once() ;
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
    verify(mockPostStatusPresenterView.displayInfoMessage(STATUS_POSTED_MESSAGE, anyNumber())).once();
    verify(mockPostStatusPresenterView.displayErrorMessage(anyString())).never();
  });

  it('On failure, tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message', async () => {
    const error = new Error("An error occurred");
    when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.doPostStatus(authToken, currentUser, postContent);

    verify(mockPostStatusPresenterView.displayErrorMessage(`Failed to post the status because of exception: An error occurred`)).once();
    verify(mockPostStatusPresenterView.clearLastInfoMessage()).once();
    verify(mockPostStatusPresenterView.setPost("")).never();
    verify(mockPostStatusPresenterView.displayInfoMessage(STATUS_POSTED_MESSAGE, anyNumber())).never();
  });
});
