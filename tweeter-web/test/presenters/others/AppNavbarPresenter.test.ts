import { anything, capture, verify, when } from "ts-mockito";
import { UserService } from "../../../src/model/service/UserService";
import { AppNavbarPresenter, AppNavbarView } from "../../../src/presenters/others/AppNavbarPresenter";
import { makeAuthToken, mockServicePresenter } from "../../utils";

describe('AppNavbarPresenter', () => {
  let mockAppNavbarPresenterView: AppNavbarView;
  let appNavbarPresenter: AppNavbarPresenter;
  let mockUserService: UserService;

  const authToken = makeAuthToken();

  beforeEach(() => {
    ({
      mockPresenterView: mockAppNavbarPresenterView,
      mockStatusService: mockUserService,
      presenterInstance: appNavbarPresenter,
    } = mockServicePresenter<AppNavbarView, UserService, AppNavbarPresenter>(v => new AppNavbarPresenter(v)));
  });

  it('tells the view to display a logging out message', async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it('calls logout on the user service with the correct AuthToken', async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockUserService.logout(anything())).once();

    let [capturedAuthToken] = capture(mockUserService.logout).last();
    expect(capturedAuthToken).toEqual(authToken);
  });

  it('tells the view to clear the last info message and clear the user info', async () => {
    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarPresenterView.displayErrorMessage(anything())).never();
    verify(mockAppNavbarPresenterView.clearLastInfoMessage()).once();
    verify(mockAppNavbarPresenterView.clearUserInfo()).once();
  });

  it('display an error message and does not tell it to clear the last info message or clear the user info', async () => {
    const error = new Error("An error occurred");
    appNavbarPresenter.reportError = jest.fn();
    when(mockUserService.logout(authToken)).thenThrow(error);

    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarPresenterView.displayErrorMessage(`Failed to log user out because of exception: An error occurred`)).once();
    expect(appNavbarPresenter.reportError).toHaveBeenCalled();
    verify(mockAppNavbarPresenterView.clearLastInfoMessage()).never();
    verify(mockAppNavbarPresenterView.clearUserInfo()).never();
  });
});
