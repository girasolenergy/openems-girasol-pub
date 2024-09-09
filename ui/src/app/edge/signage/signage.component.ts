// @ts-strict-ignore
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ChannelAddress, Edge, EdgeConfig, Service, Utils, Websocket, Widgets } from "src/app/shared/shared";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { RefresherCustomEvent } from "@ionic/angular";
import { QueryHistoricTimeseriesEnergyRequest } from "src/app/shared/jsonrpc/request/queryHistoricTimeseriesEnergyRequest";
import { QueryHistoricTimeseriesEnergyResponse } from "src/app/shared/jsonrpc/response/queryHistoricTimeseriesEnergyResponse";
import { Subject } from "rxjs";
import {getEdgeUiwidgetRequest} from  "src/app/shared/jsonrpc/request/getEdgeUiwidgetRequest";
import { getEdgeUiwidgetResponse } from "src/app/shared/jsonrpc/response/getEdgeUiwidgetResponse";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { DataService } from "src/app/shared/components/shared/dataservice";
@Component({
  selector: "signage",
  templateUrl: "./signage.component.html",
})
export class SignageComponent implements OnInit, OnDestroy {

  public edge: Edge = null;
  public config: EdgeConfig = null;
  public widgets: Widgets = null;

  public imageData0: string;
  public imageTitle0: string;
  public imageData1: string;
  public imageTitle1: string;
  public images: {imageData: string, imageTitle: string}[] = [];
  public curMonthPro: number;
  public lastMonthPro: number;
  public currentYearPro: number;
  public sensor:boolean = false;
  private stopOnDestroy: Subject<void> = new Subject<void>();


  constructor(
    private route: ActivatedRoute,
    public service: Service,
    protected utils: Utils,
    protected websocket: Websocket,
    public router: Router,
    private dataService: DataService,
  ) { }

  public ngOnInit() {
    this.service.setCurrentComponent("", this.route);
    this.service.currentEdge.pipe(takeUntil(this.stopOnDestroy)).subscribe((edge) => {
      this.edge = edge;
      const edgeId = edge?.id;
      if (typeof edgeId === "string") {
        const request = new getEdgeUiwidgetRequest({ edgeId: edgeId });
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const channels: ChannelAddress[] = [
        ChannelAddress.fromString("_sum/ProductionActiveEnergy"),
      ];

      const currentYearRequest = new QueryHistoricTimeseriesEnergyRequest(
        firstDayOfYear,
        today,
        channels,
      );
      this.edge.sendRequest(this.websocket, currentYearRequest).then((response) => {
        const result = (response as QueryHistoricTimeseriesEnergyResponse).result.data;
        this.currentYearPro = result["_sum/ProductionActiveEnergy"];
      });

      const lastMonthRequest = new QueryHistoricTimeseriesEnergyRequest(
        firstDayOfPreviousMonth,
        lastDayOfPreviousMonth,
        channels,
      );
      this.edge.sendRequest(this.websocket, lastMonthRequest).then((response) => {
        const result = (response as QueryHistoricTimeseriesEnergyResponse).result.data;
        this.lastMonthPro = result["_sum/ProductionActiveEnergy"];
      });

      const curMonthRequest = new QueryHistoricTimeseriesEnergyRequest(firstDayOfMonth,today,channels);
      this.edge.sendRequest(this.websocket, curMonthRequest).then((response) => {
        const result = (response as QueryHistoricTimeseriesEnergyResponse).result.data;
        this.curMonthPro = result["_sum/ProductionActiveEnergy"];
            },
          );
      this.websocket.sendSafeRequest(request).then((response) => {
          const metDdata = (response as getEdgeUiwidgetResponse).result.edge;
          this.imageData0 = metDdata?.[0]?.image ? "data:image/svg+xml;base64," + metDdata[0].image : "";
          this.imageTitle0 = metDdata?.[0]?.title ? metDdata[0].title : "";
          this.imageData1 = metDdata?.[1]?.image ? "data:image/svg+xml;base64," + metDdata[1].image : "";
          this.imageTitle1 = metDdata?.[1]?.title ? metDdata[1].title : "";
        }).catch((error) => {
          console.error("Error in sending request:", error);
        });
      }
    });
      this.service.getConfig().then(config => {
        this.config = config;
        this.widgets = config.widgets;

        for (const key in this.config.components) {
          if (/^sensor[0-9]*$/.test(this.config.components[key].id)) {
            this.sensor = true;
            break;
          }
        }

        // sort the Storage
        this.widgets.classes.sort((a, b) => {
        if (a === "Storage") {
          return 1;
        } else if (b === "Storage") {
          return -1;
        } else {
          return 0;
        }
      });
    });
    this.router.events.pipe(takeUntil(this.stopOnDestroy)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.endsWith("/live")) {
          window.location.reload();
        }
      }
    });

  }

  public ngOnDestroy() {
    this.stopOnDestroy.next();
    this.stopOnDestroy.complete();
  }
  protected handleRefresh: (ev: RefresherCustomEvent) => void = (ev: RefresherCustomEvent) => this.dataService.refresh(ev);
}
