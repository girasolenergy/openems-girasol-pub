import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Edge, EdgeConfig, Service, Utils, Websocket, Widgets } from 'src/app/shared/shared';

import { Subject } from 'rxjs';

@Component({
  selector: 'live',
  templateUrl: './live.component.html',
})
export class LiveComponent implements OnInit, OnDestroy {

  public edge: Edge = null;
  public config: EdgeConfig = null;
  public widgets: Widgets = null;
  private stopOnDestroy: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public service: Service,
    protected utils: Utils,
    protected websocket: Websocket,
    public router: Router,
  ) { }

  public ngOnInit() {
    this.service.setCurrentComponent('', this.route);
    this.service.currentEdge.subscribe((edge) => {
      this.edge = edge;
    });
    this.service.getConfig().then(config => {
      this.config = config;
      this.widgets = config.widgets;
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.endsWith('/history') || event.url.endsWith('/meters')|| event.url.endsWith('/signage')|| event.url.endsWith('/historysignage')) {
          window.location.reload();
        }
      }
    });
  }

  public ngOnDestroy() {
    this.stopOnDestroy.next();
    this.stopOnDestroy.complete();
  }
}
