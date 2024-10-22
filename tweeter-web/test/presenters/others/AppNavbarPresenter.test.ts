import { instance, mock, verify } from "ts-mockito";
import { AuthToken } from "tweeter-shared";
import { AppNavbarPresenter, AppNavbarView } from "../../../src/presenters/others/AppNavbarPresenter";

describe('AppNavbarPresenter', () => {
  let mockAppNavbarPresenterView: AppNavbarView;
  let appNavbarPresenter: AppNavbarPresenter;

  const authToken = new AuthToken("_fake_auth_token", Date.now());

  beforeEach(() => {
    mockAppNavbarPresenterView = mock<AppNavbarView>();
    const mockAppNavbarPresenterViewInstance = instance(mockAppNavbarPresenterView);

    appNavbarPresenter = new AppNavbarPresenter(mockAppNavbarPresenterViewInstance);
  });

  it('tells the view to display a logging out message', () => {
    appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
  });
});
