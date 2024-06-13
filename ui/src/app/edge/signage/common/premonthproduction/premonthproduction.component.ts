import { Component, Input } from '@angular/core';

import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-premonthproduction',
  templateUrl: './premonthproduction.component.html',
})
export class PreMonthProductionComponent {
  @Input() public lastMonthProduction: number;
  public getLastMonthProduction(): string {
    if (this.lastMonthProduction == null || this.lastMonthProduction === undefined) {
      return "- kWh";
    } else {
      return formatNumber(this.lastMonthProduction / 1000, 'en', '1.0-1') + ' kWh';
    }
  }
}
