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
 *   "method": "getEdgeUiwidget",
 *   "params": {
 *    "edgeId": string
 *   }
 * }
 * </pre>
 */
export class getEdgeUiwidgetRequest extends JsonrpcRequest {

    private static METHOD: string = "getEdgeUiwidget";

    public constructor(
        public override readonly params: {
            edgeId: string
        },
    ) {
        super(getEdgeUiwidgetRequest.METHOD, { edgeId: params.edgeId as string });
    }

}
