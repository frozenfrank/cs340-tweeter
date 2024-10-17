import { Status } from "tweeter-shared";
import { PagedItemPresenter } from "../PagedItemPresenter";
import { StatusService } from "../../../model/service/StatusService";

export abstract class StatusItemPresenter extends PagedItemPresenter<Status> {
  protected statusService = new StatusService();
}
