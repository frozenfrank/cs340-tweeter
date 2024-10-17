import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginPresenter, LoginView } from "../../../presenters/Authentication/LoginPresenter";
import useToastListener from "../../toaster/ToastListenerHook";
import useUserInfo from "../../userInfo/UserInfoHook";
import AuthenticationFields from "../AuthenticationFields";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import "./Login.css";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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
  const [presenter] = useState(() => new LoginPresenter(view));

  const checkSubmitButtonStatus = () => presenter.checkSubmitButtonStatus(alias, password);
  const doLogin = () => presenter.doLogin(alias, password, rememberMe);

  const loginOnEnter = async (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const inputFieldGenerator = () => {
    return (
      <AuthenticationFields onEnter={loginOnEnter} setAlias={setAlias} setPassword={setPassword} />
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
