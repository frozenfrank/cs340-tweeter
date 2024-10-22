import { MemoryRouter } from "react-router-dom";
import { anything, instance, mock, verify } from "ts-mockito";
import Login from "../../../../src/components/authentication/login/Login";
import { LoginPresenter } from "../../../../src/presenters/Authentication/LoginPresenter";
import { userEvent, render, screen, React } from "../../../ui-utils";

describe('Login Component', () => {
  it('starts  with the sign-in button disabled', () => {
    const {signInButton} = renderLoginAndGetElements("/");
    expect(signInButton).toBeDisabled();
  });

  async function enableSignInButton(elements: ReturnType<typeof renderLoginAndGetElements>) {
    const {signInButton, aliasField, passwordField, user} = elements;

    await user.type(aliasField, "a");
    await user.type(passwordField, "b");

    expect(signInButton).toBeEnabled();
  }

  it('enables the sign-in button if both alias and password fields have text', async () => {
    const elements = renderLoginAndGetElements("/");
    await enableSignInButton(elements);
  });

  it('disables the sign-in button if either field is cleared', async () => {
    const elements = renderLoginAndGetElements("/");
    await enableSignInButton(elements);

    const {signInButton, aliasField, passwordField, user} = elements;

    // Try clearing alias field
    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await enableSignInButton(elements);

    // Try clearing password field
    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenter's login method with correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "http://someurl.com";
    const alias = "@cool_alias";
    const password = "bad_password";

    const {signInButton, aliasField, passwordField, user} =
      renderLoginAndGetElements(originalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, anything())).once();
  });
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
  <MemoryRouter>
    {!!presenter ?
      (<Login originalUrl={originalUrl} presenter={presenter}></Login>)
      :
      (<Login originalUrl={originalUrl}></Login>)
    }

  </MemoryRouter>);
};

const renderLoginAndGetElements = (originalUrl: string, presenter?: LoginPresenter) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", {name: /Sign in/i});
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return {signInButton, aliasField, passwordField, user};
}
