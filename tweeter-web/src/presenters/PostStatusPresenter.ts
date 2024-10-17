import { AuthToken, Status, User } from "tweeter-shared";
import { MessageView, Presenter } from "./Presenter";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView extends MessageView {
  setIsLoading(isLoading: boolean): void;
  setPost(postContent: string): void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  protected statusService = new StatusService();

  public async doPostStatus(authToken: AuthToken, currentUser: User, postContent: string) {
    await this.doTryOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(postContent, currentUser, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");

    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }
}
