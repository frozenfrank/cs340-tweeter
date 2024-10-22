import { anyString, anything, capture, instance, mock, spy, verify, when } from "ts-mockito";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../../src/model/service/UserService";
import { AppNavbarPresenter, AppNavbarView } from "../../../src/presenters/others/AppNavbarPresenter";

describe('AppNavbarPresenter', () => {
  let mockAppNavbarPresenterView: AppNavbarView;
  let appNavbarPresenter: AppNavbarPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken("_fake_auth_token", Date.now());

  beforeEach(() => {
    // Prepare mock presenter view
    mockAppNavbarPresenterView = mock<AppNavbarView>();
    const mockAppNavbarPresenterViewInstance = instance(mockAppNavbarPresenterView);

    // Prepare mock UserService
    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    // Prepare Presenter spy to use our mock service
    const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarPresenterViewInstance));
    when(appNavbarPresenterSpy.service).thenReturn(mockUserServiceInstance);

    // Export presenter and service
    appNavbarPresenter = instance(appNavbarPresenterSpy);
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
    when(mockUserService.logout(authToken)).thenThrow(error);

    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarPresenterView.displayErrorMessage(`Failed to log user out because of exception: An error occurred`)).once();
    verify(mockAppNavbarPresenterView.clearLastInfoMessage()).never();
    verify(mockAppNavbarPresenterView.clearUserInfo()).never();
  });
});
