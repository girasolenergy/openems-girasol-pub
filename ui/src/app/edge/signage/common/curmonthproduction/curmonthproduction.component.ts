import { Component, Input } from '@angular/core';

import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-curmonthproduction',
  templateUrl: './curmonthproduction.component.html',
})
export class CurMonthProductionComponent {
  @Input() public curMonthProduction: number;
  public getCurMonthProduction(): string {
    return formatNumber(this.curMonthProduction / 1000, 'en', '1.0-1')+ ' kWh';
  }
}
