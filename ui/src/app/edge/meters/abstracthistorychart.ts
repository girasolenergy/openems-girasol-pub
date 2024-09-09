import { TranslateService } from "@ngx-translate/core";
import { isAfter } from "date-fns";
import { JsonrpcResponseError } from "../../shared/jsonrpc/base";
import { QueryHistoricTimeseriesDataRequest } from "../../shared/jsonrpc/request/queryHistoricTimeseriesDataRequest";
import { QueryHistoricTimeseriesDataResponse } from "../../shared/jsonrpc/response/queryHistoricTimeseriesDataResponse";
import { ChannelAddress, Edge, EdgeConfig, Service } from "src/app/shared/shared";
import { calculateResolution, ChartOptions,  EMPTY_DATASET} from "./shared";
import { Subject, fromEvent, interval } from "rxjs";
import { debounceTime, delay, takeUntil } from "rxjs/operators";
// NOTE: Auto-refresh of widgets is currently disabled to reduce server load
export abstract class AbstractHistoryChart {
  public loading: boolean = true;
  public labels: Date[] = [];
  // public datasets: ChartDataSets[] = EMPTY_DATASET;
  public options: ChartOptions | null = null;
  public colors = [];

  protected edge: Edge | null = null;
  // prevents subscribing more than once
  protected hasSubscribed: boolean = false;


  //observable is used to fetch new chart data every 2 minutes
  private refreshChartData = interval(120000);

  //observable is used to refresh chart height dependend on the window size
  private refreshChartHeight = fromEvent(window, "resize");

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public readonly spinnerId: string,
    protected service: Service,
    protected translate: TranslateService,
  ) {}
  /**
   * Start NGX-Spinner
   *
   * Spinner will appear inside html tag only
   *
   * @example <ngx-spinner name="YOURSELECTOR"></ngx-spinner>
   *
   * @param selector selector for specific spinner
   */
  public startSpinner() {
    this.service.startSpinner(this.spinnerId);
  }

  /**
   * Stop NGX-Spinner
   * @param selector selector for specific spinner
   */
  public stopSpinner() {
    this.service.stopSpinner(this.spinnerId);
  }

  protected queryHistoricTimeseriesDataMeter(
    fromDate: Date,
    toDate: Date,
    channelAddresses: ChannelAddress[],
  ): Promise<QueryHistoricTimeseriesDataResponse> {
    const resolution = calculateResolution(
      this.service,
      fromDate,
      toDate,
    ).resolution;

    return new Promise((resolve, reject) => {
      this.service.getCurrentEdge().then((edge) => {
        this.service.getConfig().then((config) => {
          // this.setLabel(config);
          const request = new QueryHistoricTimeseriesDataRequest(
            fromDate,
            toDate,
            channelAddresses,
            resolution,
          );
          edge
            .sendRequest(this.service.websocket, request)
            .then((response) => {
              const result = (response as QueryHistoricTimeseriesDataResponse)
                .result;

              if (
                Object.keys(result.data).length != 0 &&
                Object.keys(result.timestamps).length != 0
              ) {
                resolve(response as QueryHistoricTimeseriesDataResponse);
              } else {
                reject(
                  new JsonrpcResponseError(response.id, {
                    code: 0,
                    message: "Result was empty",
                  }),
                );
              }
            })
            .catch((reason) => reject(reason));
        });
      });
    });
  }

  /**
   * checks if chart is allowed to be refreshed
   *
   */
  protected checkAllowanceChartRefresh(): boolean {
    const currentDate = new Date();
    let allowRefresh: boolean = false;
    if (
      isAfter(this.service.historyPeriod.value.to, currentDate) ||
      currentDate.getDate() == this.service.historyPeriod.value.from.getDate()
    ) {
      allowRefresh = true;
    } else {
      allowRefresh = false;
    }
    return allowRefresh;
  }

  /**
   * Subscribe to Chart Refresh if allowed
   * Unsubscribe to Chart Refresh if necessary
   */
  protected autoSubscribeChartRefresh() {
    // XXX disabled to reduce server load

    if (
      this.hasSubscribed == false &&
      this.checkAllowanceChartRefresh() == true
    ) {
      if (this.ngUnsubscribe.isStopped == true) {
        this.ngUnsubscribe.isStopped = false;
      }
      this.refreshChartData
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.updateChart();
        });
      this.refreshChartHeight
        .pipe(takeUntil(this.ngUnsubscribe), debounceTime(200), delay(100))
        .subscribe(() => {
          this.getChartHeight();
        });
      this.hasSubscribed = true;
    } else if (
      this.hasSubscribed == true &&
      this.checkAllowanceChartRefresh() == false
    ) {
      this.unsubscribeChartRefresh();
    }
  }

  /**
   * Unsubscribes to 10 minute Interval Observable and Window Resize Observable
   */
  protected unsubscribeChartRefresh() {
    // XXX disabled to reduce server load

    this.hasSubscribed = false;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Initializes empty chart on error
   * @param spinnerSelector to stop spinner
   */
  protected initializeChart() {
    EMPTY_DATASET[0].label = this.translate.instant("Edge.History.noData");
    // this.datasets = EMPTY_DATASET;
    this.labels = [];
    this.loading = false;
    this.stopSpinner();
  }

  /**
   * Sets Chart Height
   */
  protected abstract getChartHeight();
  /**
   * Sets the Label of Chart
   */
  protected abstract setLabel(config: EdgeConfig);
  /**
   * Updates and Fills the Chart
   */
  protected abstract updateChart();
}
