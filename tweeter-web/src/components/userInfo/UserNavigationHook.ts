import { UserNavigationPresenter, UserNavigationView } from "../../presenters/UserNavigationPresenter";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";

interface UserNavigation {
  navigateToUser(event: React.MouseEvent): Promise<void>;
}

const useUserNavigation = (): UserNavigation => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();

  const view: UserNavigationView = {
    setDisplayedUser,
    displayErrorMessage,
  };
  const presenter = new UserNavigationPresenter(view);

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    const alias = event.target.toString();
    await presenter.navigateToUser(authToken!, currentUser!, alias);
  };

  return { navigateToUser };
};

export default useUserNavigation;
