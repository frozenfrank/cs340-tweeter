import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FeedPresenter } from "./presenters/Item/Status/FeedPresenter";
import { FolloweePresenter } from "./presenters/Item/Followx/FolloweePresenter";
import { FollowerPresenter } from "./presenters/Item/Followx/FollowerPresenter";
import { StoryPresenter } from "./presenters/Item/Status/StoryPresenter";
import { LoginPresenter, LoginView } from "./presenters/LoginPresenter";
import { RegisterPresenter } from "./presenters/RegisterPresenter";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <StatusItemScroller
              key={1}
              presenterGenerator={view => new FeedPresenter(view)}
            />
          }
        />
        <Route
          path="story"
          element={
            <StatusItemScroller
              key={2}
              presenterGenerator={view => new StoryPresenter(view)}
            />
          }
        />
        <Route
          path="followees"
          element={
            <UserItemScroller
              key={1}
              presenterGenerator={view => new FolloweePresenter(view)}
            />
          }
        />
        <Route
          path="followers"
          element={
            <UserItemScroller
              key={2}
              presenterGenerator={view => new FollowerPresenter(view)}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  const loginPresenterGenerator = (view: LoginView) => new LoginPresenter(view);

  return (
    <Routes>
      <Route path="/login" element={<Login presenterGenerator={loginPresenterGenerator}/>} />
      <Route path="/register" element={<Register presenterGenerator={view => new RegisterPresenter(view)}/>} />
      <Route path="*" element={
        <Login originalUrl={location.pathname} presenterGenerator={loginPresenterGenerator} />
      } />
    </Routes>
  );
};

export default App;
