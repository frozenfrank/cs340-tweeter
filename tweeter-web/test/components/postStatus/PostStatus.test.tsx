import PostStatus from "../../../src/components/postStatus/PostStatus";
import { PostStatusPresenter } from "../../../src/presenters/others/PostStatusPresenter";
import {userEvent, render, screen, React} from  "../../ui-utils";

describe('PostStatus Component', () => {
  it('begins with PostStatus and Clear buttons disabled', async () => {
    const {submitButton, clearButton} = renderPostStatusAndGetElements();
    expect(submitButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it('enables both buttons when the text field has text', async () => {

  });

  it('disables both buttons when the text field is cleared', async () => {

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
