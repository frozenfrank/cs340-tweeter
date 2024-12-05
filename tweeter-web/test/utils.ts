import { instance, mock, spy, when } from "ts-mockito";
import { Presenter, ServicePresenter, View } from "../src/presenters/Presenter";
import { AuthToken, Status, User } from "tweeter-shared";

export function mockPresenter<V extends View, P extends Presenter<V>>(presenterGenerator: (view: V) => P) {

  // Prepare mock view
  const mockPresenterView = mock<V>();
  const mockStatusPresenterInstance = instance(mockPresenterView) as V;

  // Prepare presenter spy
  const presenterSpy = spy(presenterGenerator(mockStatusPresenterInstance));
  const presenterInstance = instance(presenterSpy);

  // Return results
  return {mockPresenterView, presenterInstance, presenterSpy};
}

export function mockServicePresenter<V extends View, U, P extends ServicePresenter<V, U>>(presenterGenerator: (view: V) => P) {

  const {mockPresenterView, presenterInstance, presenterSpy} = mockPresenter(presenterGenerator);

  // Prepare mock service
  const mockStatusService = mock<U>();
  const mockServiceInstance = instance(mockStatusService);
  when(presenterSpy.service).thenReturn(mockServiceInstance);

  // Return results
  return {mockPresenterView, mockStatusService, presenterInstance};
}

export const makeAuthToken = () => new AuthToken("_fake_auth_token", Date.now(), "testing");
export const makeUser = () => new User("Donald", "Duck", "@donald_duck", "s3://donald_duck.jpg", "$HASHED_PASSWORD$");
export const makeStatus = (postContent = "Hello, world!") => new Status(postContent, makeUser(), +new Date);

export const makeNUsers = (N: number) => Array.from({ length: N }, () => makeUser());
