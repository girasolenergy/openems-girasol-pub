
import { JsonrpcResponseSuccess } from "../base";

export interface LimitResponse {
  id: string,
  key: string,
  value: number
}
export class getEdgeUimiscResponse extends JsonrpcResponseSuccess {

  public constructor(
    public override readonly id: string,
    public override readonly result: {
      edge: LimitResponse[]
    },
) {
    super(id, result);
}

}
