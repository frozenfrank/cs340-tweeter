import { AuthToken, User } from "tweeter-shared";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { PostStatusPresenter } from "../../../src/presenters/others/PostStatusPresenter";
import {userEvent, render, screen, React} from  "../../ui-utils";
import { makeAuthToken, makeUser } from "../../utils";

// Mock UserInfoHook to provide authentication status
jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe('PostStatus Component', () => {
  let currentUser: User;
  let authToken: AuthToken;

  beforeAll(() => {
    currentUser = makeUser();
    authToken = makeAuthToken();

    (useUserInfo as jest.Mock).mockReturnValue({currentUser, authToken});
  });

  it('begins with PostStatus and Clear buttons disabled', async () => {
    const {submitButton, clearButton} = renderPostStatusAndGetElements();
    expect(submitButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  async function authorPostMessage(elements: ReturnType<typeof renderPostStatusAndGetElements>) {
    const {textField, submitButton, clearButton, user} = elements;
    await user.type(textField, "Post content...");
    expect(submitButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  }

  it('enables both buttons when the text field has text', async () => {
    const elements = renderPostStatusAndGetElements();
    await authorPostMessage(elements);
  });

  it('disables both buttons when the text field is cleared', async () => {
    const elements = renderPostStatusAndGetElements();
    await authorPostMessage(elements);

    const {textField, submitButton, clearButton, user} = elements;

    // Clear it once
    await user.clear(textField);
    expect(submitButton).toBeDisabled();
    expect(clearButton).toBeDisabled();

    // Reenables
    await authorPostMessage(elements);
  });

  it("calls the presenter's postStatus method with the correct parameters when PostStatus button is pressed", async () => {

  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <PostStatus presenter={presenter}></PostStatus>
  );
};

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const submitButton = screen.getByRole("button", {name: /Post Status/i});
  const clearButton = screen.getByRole("button", {name: /Clear/i});
  const textField = screen.getByLabelText("post-content");

  return {submitButton, clearButton, textField, user};
}
