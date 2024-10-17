import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { LoadingPresenter, LoadingView, MessageView } from "./Presenter";

export interface PostStatusView extends LoadingView, MessageView {
  setPost(postContent: string): void;
}

export class PostStatusPresenter extends LoadingPresenter<PostStatusView, StatusService> {
  override buildService() { return new StatusService(); }

  public async doPostStatus(authToken: AuthToken, currentUser: User, postContent: string) {
    await this.doTryOperation(async () => {
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(postContent, currentUser, Date.now());

      await this.service.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");

    this.view.clearLastInfoMessage();
  }
}
