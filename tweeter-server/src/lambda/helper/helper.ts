import { TweeterResponse, ValueResponse } from "tweeter-shared";
import { RudimentaryData } from "tweeter-shared/dist/model/net/response/ValueResponse";

export function packageValueResponse<V extends RudimentaryData>(value: V): ValueResponse<V> {
  // TODO: Verify results and sometimes throw an error instead?
  return packageResponse({value});
}

export function packageResponse<T extends {}>(fields: T): T & TweeterResponse {
  return {
    ...fields,
    success: true
  };
}

export function successfulEmptyResponse() {
  return { success: true };
}
