import { ChannelAddress } from "../../../shared/type/channeladdress";
import { format } from 'date-fns';
import { JsonrpcRequest } from "../base";
import { JsonRpcUtils } from "../jsonrpcutils";
import { Resolution } from "src/app/edge/history/shared";

/**
 * Represents a JSON-RPC Request to query Historic Timeseries Data.
 *
 * <pre>
{
  "method":"edgeRpc",
  "params":{
     "edgeId":"gw-komevillage-3",
     "payload": {
                "id": "3c3e599c-87e8-4e51-9a3b-6c13f8a3f26f",
                "jsonrpc": "2.0",
                "method": "queryHistoricTimeseriesData",
                "params": {
                        "timezone" : "Asia/Tokyo",
                        "fromDate" : "2023-07-01",
                        "toDate" : "2023-07-31",
                        "channels" : ["_sum/ConsumptionActiveEnergy"],
                        "resolution":{
                                        "value": 1,
                                        "unit": "Days"
                                    }
                            }
                }
            }
}
 * </pre>
 */
export class QueryHistoricTimeseriesDataRequest extends JsonrpcRequest {

    private static METHOD: string = "queryHistoricTimeseriesData";

    public constructor(
        private fromDate: Date,
        private toDate: Date,
        private channels: ChannelAddress[],
        private resolution: Resolution,
    ) {
        super(QueryHistoricTimeseriesDataRequest.METHOD, {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            fromDate: format(fromDate, 'yyyy-MM-dd'),
            toDate: format(toDate, 'yyyy-MM-dd'),
            channels: JsonRpcUtils.channelsToStringArray(channels),
            resolution: resolution,
        });
        // delete local fields, otherwise they are sent with the JSON-RPC Request
        delete this.fromDate;
        delete this.toDate;
        delete this.channels;
        delete this.resolution;
    }

}
