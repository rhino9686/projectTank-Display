import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { XBeeHandler } from './x-bee-handler';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'displayProject';
  clickMessage: string;
  private xbee: XBeeHandler;

  constructor() {
    this.xbee = new XBeeHandler('/dev/tty.usbserial-AL02BYQV');
  }


  onClickMe() {
    this.clickMessage = 'You are my hero!';
  }


}
