// @ts-strict-ignore
import { ChannelAddress } from "../../type/channeladdress";
import { JsonRpcUtils } from "../jsonrpcutils";
import { JsonrpcRequest } from "../base";
import { Resolution } from "src/app/edge/history/shared";
import { format } from "date-fns";

/**
 * Represents a JSON-RPC Request to query Timeseries Energy data.
 *
 * <pre>
{
  "method":"edgeRpc",
  "params":{
     "edgeId":"gw-komevillage-3",
     "payload": {
                "id": "3c3e599c-87e8-4e51-9a3b-6c13f8a3f26f",
                "jsonrpc": "2.0",
                "method": "queryHistoricTimeseriesEnergyPerPeriod",
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
export class QueryHistoricTimeseriesEnergyPerPeriodRequest extends JsonrpcRequest {


    private static METHOD: string = "queryHistoricTimeseriesEnergyPerPeriod";

    public constructor(
        private fromDate: Date,
        private toDate: Date,
        private channels: ChannelAddress[],
        private resolution: Resolution,
    ) {
        super(QueryHistoricTimeseriesEnergyPerPeriodRequest.METHOD, {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            fromDate: format(fromDate, "yyyy-MM-dd"),
            toDate: format(toDate, "yyyy-MM-dd"),
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

