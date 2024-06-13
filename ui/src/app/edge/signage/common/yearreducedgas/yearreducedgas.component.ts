import { Component, Input } from '@angular/core';

import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-yearreducedgas',
  templateUrl: './yearreducedgas.component.html',
})
export class YearReducedgasComponent {
  @Input() public currentYearProduction: number;

  public getYearReduction(): string {
    let co2_gas_rate = 0.623;
    return formatNumber(this.currentYearProduction / 1000 * co2_gas_rate, 'en', '1.0-1')+ ' kg';
  }

}
