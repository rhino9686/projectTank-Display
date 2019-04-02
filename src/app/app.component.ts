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
  xbee;

  constructor() {

  }


  onClickMe() {
    this.clickMessage = 'You are my hero!';
  }


}
