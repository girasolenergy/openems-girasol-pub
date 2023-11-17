import { ChannelAddress } from '../../type/channeladdress';
import { JsonRpcUtils } from '../jsonrpcutils';
import { JsonrpcRequest } from '../base';
import { format } from 'date-fns';

/**
 * Queries historic timeseries data; exports to Csv file.
 *
 * <pre>
 * {
 *   "jsonrpc": "2.0",
 *   "id": "UUID",
 *   "method": "queryHistoricExportXlxs",
 *   "params": {
 *     "timezone": Number,
 *     "fromDate": YYYY-MM-DD,
 *     "toDate": YYYY-MM-DD,
 *     "channels": ["meter1/ConsumptionActiveEnergy"]
 *   }
 * }
 * </pre>
 */
export class QueryHistoricExportXlxsRequest extends JsonrpcRequest {
  public static METHOD: string = 'queryHistoricExportXlxs';

  public constructor(
    private fromDate: Date,
    private toDate: Date,
    private channels: ChannelAddress[]
  ) {
    super(QueryHistoricExportXlxsRequest.METHOD, {
      timezone: new Date().getTimezoneOffset() * 60,
      fromDate: format(fromDate, 'yyyy-MM-dd'),
      toDate: format(toDate, 'yyyy-MM-dd'),
      channels: JsonRpcUtils.channelsToStringArray(channels),
    });

    // deleted from the instance to prevent them from being sent with the JSON-RPC request payload.
    delete this.fromDate;
    delete this.toDate;
    delete this.channels;
  }
}
