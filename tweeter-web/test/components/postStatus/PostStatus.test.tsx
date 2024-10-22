import PostStatus from "../../../src/components/postStatus/PostStatus";
import { PostStatusPresenter } from "../../../src/presenters/others/PostStatusPresenter";
import {userEvent, render, screen, React} from  "../../ui-utils";

describe('PostStatus Component', () => {
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
    authorPostMessage(elements);
  });

  it('disables both buttons when the text field is cleared', async () => {
    const elements = renderPostStatusAndGetElements();
    authorPostMessage(elements);

    const {textField, submitButton, clearButton, user} = elements;

    // Clear it once
    await user.clear(textField);
    expect(submitButton).toBeDisabled();
    expect(clearButton).toBeDisabled();

    // Reenables
    authorPostMessage(elements);
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
