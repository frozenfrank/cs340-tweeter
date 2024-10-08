import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginPresenter, LoginView } from "../../../presenters/LoginPresenter";
import useToastListener from "../../toaster/ToastListenerHook";
import useUserInfo from "../../userInfo/UserInfoHook";
import AuthenticationFields from "../AuthenticationFields";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import "./Login.css";

interface Props {
  presenterGenerator: (view: LoginView) => LoginPresenter;
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const view: LoginView = {
    setIsLoading,
    updateUserInfo,
    displayErrorMessage,
    navigate,
    originalUrl: props.originalUrl,
  };
  const [presenter] = useState(props.presenterGenerator(view));

  const loginOnEnter = async (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !presenter.checkSubmitButtonStatus()) {
      presenter.doLogin();
    }
  };

  // TODO: The `presenter.setAlias()` is not preserving the `this` value correctly and doesn't work.
  const inputFieldGenerator = () => {
    return (
      <AuthenticationFields onEnter={loginOnEnter} setAlias={presenter.setAlias} setPassword={presenter.setPassword} />
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  // TODO: The `presenter.setAlias()` is not preserving the `this` value correctly and doesn't work.
  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={presenter.setRememberMe}
      submitButtonDisabled={presenter.checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={presenter.doLogin}
    />
  );
};

export default Login;
