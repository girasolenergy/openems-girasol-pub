import { Component, Input } from "@angular/core";

@Component({
  selector: "LogoView",
  templateUrl: "./logoview.html",
})
export class LogoComponent {

  @Input() public imageData0: string;
  @Input() public imageTitle0: string;
}
