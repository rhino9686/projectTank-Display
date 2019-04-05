import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { Cat } from './models/cat';
import { SerialportService } from './services/serialport.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'displayProject';
  clickMessage: string;
  catString: string;
  mycats: Observable<Cat[]>;

  constructor(private catservice: SerialportService) {

  }


  onClickMe() {
    this.clickMessage = 'You are my hero!';
    this.getCats();
  }

  getCats() {
    this.mycats = this.catservice.getAllCats();
    this.mycats.subscribe((res) => console.log(res));
  }

}
