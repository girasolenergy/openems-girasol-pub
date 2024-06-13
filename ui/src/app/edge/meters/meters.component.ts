import { Component, OnInit, ViewChild } from '@angular/core';
import { Edge, EdgeConfig, Service, Widgets } from 'src/app/shared/shared';

import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { environment } from 'src/environments';

@Component({
  selector: 'meters',
  templateUrl: 'meters.component.html',
})
//implements AfterViewInit
export class MetersComponent implements OnInit {
  @ViewChild(HeaderComponent, { static: false })
  public HeaderComponent: HeaderComponent;


  // holds the Widgets
  public widgets: Widgets = null;

  // holds the current Edge
  public edge: Edge = null;


  public config: EdgeConfig = null;
  public meters: EdgeConfig.Component[] = [];

  constructor(
    public service: Service,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.service.setCurrentComponent('', this.route).then((edge) => {
      this.edge = edge;
    });
    this.service.getConfig().then((config) => {
      // gather ControllerIds of Channelthreshold Components
      for (let controllerId of config
        .getComponentIdsImplementingNature(
          'io.openems.impl.controller.channelthreshold.ChannelThresholdController',
        )
        .concat(
          config.getComponentIdsByFactory('Controller.ChannelThreshold'),
        )) {
        //this.channelthresholdComponents.push(controllerId);
      }

      this.config = config;
      console.log('config', this.config.components);
      for (let componentId in config.components) {
        let component = config.components[componentId];
        if (component.factoryId.startsWith('Meter.')) {
          this.meters.push(component);
        }
      }

      config.hasStorage();
      this.widgets = config.widgets;

      // Are we connected to OpenEMS Edge and is a timedata service available?
      if (
        environment.backend == 'OpenEMS Edge' &&
        config
          .getComponentsImplementingNature(
            'io.openems.edge.timedata.api.Timedata',
          )
          .filter((c) => c.isEnabled).length == 0
      ) {
        //this.isTimedataAvailable = false;
      }
    });
  }

  // checks arrows when ChartPage is closed 当组件路由完成动画时触发,即在转换结束后立即触发.
  // double viewchild is used to prevent undefined state of PickDateComponent
  ionViewDidEnter() {
    this.HeaderComponent.PickDateComponent.checkArrowAutomaticForwarding();
  }
}
