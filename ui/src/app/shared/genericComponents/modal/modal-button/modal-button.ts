import { Component, Input } from '@angular/core';

import { AbstractModalLine } from '../abstract-modal-line';
import { Icon } from 'src/app/shared/type/widget';

@Component({
  selector: 'oe-modal-buttons',
  templateUrl: './modal-button.html',
})
export class ModalButtonsComponent extends AbstractModalLine {
  public _buttons: ButtonLabel[] = [];
  //@Input() protected buttons: ButtonLabel[];
  @Input() set buttons(b: ButtonLabel[]) {
    console.log(123456789, b);
    this._buttons = b;
  }
  get buttons() {
    return this._buttons;
  }
}

export type ButtonLabel = {
  /** Name of Label, displayed below the icon */
  name: string;
  value: string;
  /** Icons for Button, displayed above the corresponding name */
  icons?: Icon;
  callback?: Function;
};
