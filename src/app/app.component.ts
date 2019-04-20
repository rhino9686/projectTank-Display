import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Cat } from './models/cat';
import { SerialportService } from './services/serialport.service';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Setup } from './models/setup';



export interface DialogData {
  tankOneName: string;
  tankOnePower: string;
  tankTwoName: string;
  tankTwoPower: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Lil Tanks';
  catString = 'nothing yet!';
  mycats: Observable<Cat[]>;
  cats: Cat[];
  mycat: Cat;
  setup: Setup;


  // Health Bar Settings
  color = 'warn';
  mode = 'determinate';
  tank1value = 75;
  tank2value = 50;
  tank1bufferValue = 75;

  // Tank Parameters
  tankOneName: string;
  tankOnePower: string;
  tankTwoName: string;
  tankTwoPower: string;




  constructor( public dialog: MatDialog, private serialservice: SerialportService, private snackbar: MatSnackBar) {

  }

  ngOnInit(): void {
     this.serialservice.tankOneSubject.subscribe(val => { this.updateTankOne(val); });
     this.serialservice.tankTwoSubject.subscribe(val => { this.updateTankTwo(val); });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
      width: '900px',
      height: '550px',
      data: {tankOneName: this.tankOneName , tankOnePower: this.tankOnePower, tankTwoName: this.tankTwoName,
         tankTwoPower: this.tankTwoPower
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.tankOneName = result.tankOneName;
      this.tankTwoName = result.tankTwoName;
      this.tankOnePower = result.tankOnePower;
      this.tankTwoPower = result.tankTwoPower;
    });

   }


  printTankData() {
    console.log('Tank One Name: ' + this.tankOneName);
    console.log('Tank Two Name: ' + this.tankTwoName);
    console.log('Tank One Power ' + this.tankOnePower);
    console.log('Tank Two Power: ' + this.tankTwoPower);
  }
  updateTankOne(healthObj: any ) {
      const num = healthObj['health'];
      console.log(num);
      this.tank1value = num;
  }

  updateTankTwo(healthObj: any ) {
    const num = healthObj['health'];
    console.log(num);
  }


  initTanks() {
    this.initTankOne();
    this.initTankTwo();
    this.serialservice.activate();
  }

  initTankOne() {
    let powType = -3;

    if (this.tankOnePower === 'moreHealth') {
      powType = 1;
    } else if (this.tankOnePower === 'fastMove') {
      powType = 2;
    } else if (this.tankOnePower === 'fastAim') {
      powType = 3;
    }
    if (powType < 0) {
      console.log('ERROR: no power choice for tank one!');
      return;
    }

    this.setup = { type: powType };
    this.serialservice.sendSetupTankOne(this.setup).subscribe((res) => {console.log(res); });
  }

  initTankTwo() {
    let powType = -3;

    if (this.tankTwoPower === 'moreHealth') {
      powType = 1;
    } else if (this.tankTwoPower === 'fastMove') {
      powType = 2;
    } else if (this.tankTwoPower === 'fastAim') {
      powType = 3;
    }
    if (powType < 0) {
      console.log('ERROR: no power choice for tank two!');
      return;
    }

    this.setup = { type: powType };
    this.serialservice.sendSetupTankTwo(this.setup);
  }

  testConnection() {
     // this.serialservice.getTankOneHealth('yeet').subscribe((val) => console.log(val) );
    //  this.serialservice.activate();
    this.initTankOne();
  }

}

@Component({
  selector: 'app-dialog-overview',
  templateUrl: 'dialog-overview.html',
  styleUrls: ['dialog-overview.css']
})
export class DialogOverviewComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  color: string;


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
