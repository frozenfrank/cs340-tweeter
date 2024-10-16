import { Status } from "tweeter-shared";
import { ItemPresenter } from "../ItemPresenter";
import { StatusService } from "../../../model/service/StatusService";

export abstract class StatusItemPresenter extends ItemPresenter<Status> {
  protected statusService = new StatusService();
}
