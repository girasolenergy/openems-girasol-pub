import { Component, Input } from "@angular/core";

import { formatNumber } from "@angular/common";

@Component({
  selector: "app-yearproduction",
  templateUrl: "./yearproduction.component.html",
})
export class YearProductionComponent {
  @Input() public currentYearProduction: number;
  public getYearProduction(): string {
    return formatNumber(this.currentYearProduction / 1000, "en", "1.0-1")+ " kWh";
  }
}
