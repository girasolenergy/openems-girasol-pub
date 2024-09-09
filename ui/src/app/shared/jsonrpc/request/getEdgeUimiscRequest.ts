import { JsonrpcRequest } from "../base";

/**
 * Represents a JSON-RPC Request to get a image.
 *
 * <p>
 * This is used by UI to get an image.
 *
 * <pre>
 * {
 *   "jsonrpc": "2.0",
 *   "id": "UUID",
 *   "method": "getEdgeUimisc",
 *   "params": {
 *    "edgeId": string
 *   }
 * }
 * </pre>
 */
export class getEdgeUimiscRequest extends JsonrpcRequest {

    private static METHOD: string = "getEdgeUimisc";

    public constructor(
        public override readonly params: {
            edgeId: string
        },
    ) {
        super(getEdgeUimiscRequest.METHOD, params);
    }

}
