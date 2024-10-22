import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import "@testing-library/jest-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fab);

describe('Login Component', () => {
  it('starts  with the sign-in button disabled', () => {
    const {signInButton} = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  async function enableSignInButton(elements: ReturnType<typeof renderLoginAndGetElement>) {
    const {signInButton, aliasField, passwordField, user} = elements;

    await user.type(aliasField, "a");
    await user.type(passwordField, "b");

    expect(signInButton).toBeEnabled();
  }

  it('enables the sign-in button if both alias and password fields have text', async () => {
    const elements = renderLoginAndGetElement("/");
    await enableSignInButton(elements);
  });

  it('disables the sign-in button if either field is cleared', async () => {
    const elements = renderLoginAndGetElement("/");
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
});

const renderLogin = (originalUrl: string) => {
  return render(<MemoryRouter>
    <Login originalUrl={originalUrl}></Login>
  </MemoryRouter>);
};

const renderLoginAndGetElement = (originalUrl: string) => {
  const user = userEvent.setup();

  renderLogin(originalUrl);

  const signInButton = screen.getByRole("button", {name: /Sign in/i});
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return {signInButton, aliasField, passwordField, user};
}
