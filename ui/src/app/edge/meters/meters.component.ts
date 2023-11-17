import { Component, OnInit, ViewChild } from '@angular/core';
import { Edge, EdgeConfig, Service, Widgets } from 'src/app/shared/shared';

import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments';

@Component({
  selector: 'meters',
  templateUrl: 'meters.component.html',
})
//implements AfterViewInit
export class MetersComponent implements OnInit {
  @ViewChild(HeaderComponent, { static: false })
  public HeaderComponent: HeaderComponent;
  // 允许从父组件调用子组件函数。当父组件需要来自子组件的信息来组成最终结果时,获取子组件dom元素.

  // is a Timedata service available, i.e. can historic data be queried.
  public isTimedataAvailable: boolean = true;

  // sets the height for a chart. This is recalculated on every window resize.
  public socChartHeight: string = '250px';
  public energyChartHeight: string = '250px';

  // holds the Widgets
  public widgets: Widgets = null;

  // holds the current Edge
  public edge: Edge = null;

  // holds Channelthreshold Components to display effective active time in %
  public channelthresholdComponents: string[] = [];

  public config: EdgeConfig = null;
  public meters: EdgeConfig.Component[] = [];

  constructor(
    public service: Service,
    public translate: TranslateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.service.setCurrentComponent('', this.route).then((edge) => {
      this.edge = edge;
    });
    this.service.getConfig().then((config) => {
      // gather ControllerIds of Channelthreshold Components
      for (let controllerId of config
        .getComponentIdsImplementingNature(
          'io.openems.impl.controller.channelthreshold.ChannelThresholdController'
        )
        .concat(
          config.getComponentIdsByFactory('Controller.ChannelThreshold')
        )) {
        this.channelthresholdComponents.push(controllerId);
      }

      this.config = config;
      console.log('config', this.config.components);
      for (let componentId in config.components) {
        let component = config.components[componentId];
        if (component.factoryId.startsWith('Meter.')) {
          this.meters.push(component);
          console.log('收集的meter对象', this.meters);
        }
      }

      config.hasStorage();
      this.widgets = config.widgets;

      // Are we connected to OpenEMS Edge and is a timedata service available?
      if (
        environment.backend == 'OpenEMS Edge' &&
        config
          .getComponentsImplementingNature(
            'io.openems.edge.timedata.api.Timedata'
          )
          .filter((c) => c.isEnabled).length == 0
      ) {
        this.isTimedataAvailable = false;
      }
    });
  }

  // checks arrows when ChartPage is closed 当组件路由完成动画时触发,即在转换结束后立即触发.
  // double viewchild is used to prevent undefined state of PickDateComponent
  ionViewDidEnter() {
    this.HeaderComponent.PickDateComponent.checkArrowAutomaticForwarding();
  }
  updateOnWindowResize() {
    let ref = /* fix proportions */ Math.min(
      window.innerHeight - 150,
      /* handle grid breakpoints */ window.innerWidth < 768
        ? window.innerWidth - 150
        : window.innerWidth - 400
    );
    this.socChartHeight =
      /* minimum size */ Math.max(150, /* maximium size */ Math.min(200, ref)) +
      'px';
    this.energyChartHeight =
      /* minimum size */ Math.max(300, /* maximium size */ Math.min(600, ref)) +
      'px';
  }
}
