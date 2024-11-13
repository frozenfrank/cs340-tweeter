import { TweeterResponse } from "./TweeterResponse";

type Primitive = string | number | boolean;
export type RudimentaryData = Primitive | Primitive[] | Record<string, Primitive>;

export interface ValueResponse<V extends RudimentaryData> extends TweeterResponse {
  value: V;
}
