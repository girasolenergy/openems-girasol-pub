import { Component, OnInit, ViewChild } from "@angular/core";
import { Edge, EdgeConfig, Service, Widgets } from "src/app/shared/shared";

import { ActivatedRoute } from "@angular/router";
import { HeaderComponent } from "src/app/shared/components/header/header.component";
import { environment } from "src/environments";

@Component({
  selector: "meters",
  templateUrl: "meters.component.html",
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
  ) { }

  ngOnInit() {
    this.service.setCurrentComponent("", this.route).then((edge) => {
      this.edge = edge;
    });
    this.service.getConfig().then((config) => {
      // gather ControllerIds of Channelthreshold Components
      this.config = config;
      console.log("config", this.config.components);
      for (const componentId in config.components) {
        const component = config.components[componentId];
        if (component.factoryId.startsWith("Meter.")) {
          this.meters.push(component);
        }
      }

      config.hasStorage();
      this.widgets = config.widgets;

      // Are we connected to OpenEMS Edge and is a timedata service available?
      if (
        environment.backend == "OpenEMS Edge" &&
        config
          .getComponentsImplementingNature(
            "io.openems.edge.timedata.api.Timedata",
          )
          .filter((c) => c.isEnabled).length == 0
      ) {
        //this.isTimedataAvailable = false;
      }
    });
  }

  // double viewchild is used to prevent undefined state of PickDateComponent
  ionViewDidEnter() {
    this.HeaderComponent?.PickDateComponent?.checkArrowAutomaticForwarding();
  }
}
