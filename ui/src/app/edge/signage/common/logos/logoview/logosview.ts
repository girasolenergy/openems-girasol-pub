import { Component, Input } from "@angular/core";

@Component({
  selector: "LogosView",
  templateUrl: "./logosview.html",
})
export class LogosComponent {

  @Input() public imageData1: string;
  @Input() public imageTitle1: string;

}
