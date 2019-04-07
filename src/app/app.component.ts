import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Cat } from './models/cat';
import { SerialportService } from './services/serialport.service';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Lil Tanks';
  catString = 'nothing yet!';
  mycats: Observable<Cat[]>;
  cats: Cat[];
  mycat: Cat;

  animal: string;
  name: string;

  color = 'warn';
  mode = 'determinate';
  tank1value = 50;
  tank2value = 50;
  tank1bufferValue = 75;


  subscription: Subscription;

  constructor( public dialog: MatDialog, private serialservice: SerialportService) {

  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
      width: '900px',
      height: '550px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });

   }

  onClickMe() {
    this.getCats();
  }

  getCats() {
    this.mycats = this.serialservice.getAllCats();

    this.mycats.subscribe((res) =>  {
      console.log(res);

      this.cats = res['cats'];
      console.log(this.cats);
      console.log(this.cats[0]);
      this.mycat = this.cats[0];
      this.catString = this.mycat.name;

    });
  }

}

@Component({
  selector: 'app-dialog-overview',
  templateUrl: 'dialog-overview.html',
})
export class DialogOverviewComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  color: string;

  firstTankName: string;
  secondTankName: string;
  firstTankPowerUp: string;
  secondTankPowerUp: string;


  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required],
        color: ['' , Validators.required]
      });
      this.secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required]
      });
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
