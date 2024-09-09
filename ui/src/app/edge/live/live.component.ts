import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { RefresherCustomEvent } from "@ionic/angular";
import { Subject } from "rxjs";
import { DataService } from "src/app/shared/components/shared/dataservice";
import { Edge, EdgeConfig, Service, Utils, Websocket, Widgets } from "src/app/shared/shared";

@Component({
  selector: "live",
  templateUrl: "./live.component.html",
})
export class LiveComponent implements OnInit, OnDestroy {

  public edge: Edge | null = null;
  public config: EdgeConfig | null = null;
  public widgets: Widgets | null = null;
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
    this.service.currentEdge.subscribe((edge) => {
      this.edge = edge;
    });
    this.service.getConfig().then(config => {
      this.config = config;
      this.widgets = config.widgets;
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.endsWith("/history") || event.url.endsWith("/meters")|| event.url.endsWith("/signage")|| event.url.endsWith("/historysignage")) {
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
