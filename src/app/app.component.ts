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
  tankOneColor: string;
  tankTwoColor: string;
}

export interface WinnerData {
  winner: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Lil Tanks';


  // Health Bar Settings
  color = 'warn';
  mode = 'determinate';
  tankOneValue = 75;
  tankTwoValue = 50;
  tank1bufferValue = 75;

  // Tank Parameters
  tankOneName: string;
  tankOnePower: string;
  tankTwoName: string;
  tankTwoPower: string;
  tankOneColor: string;
  tankTwoColor: string;

  constructor( public dialog: MatDialog, public dialog2: MatDialog,
     private serialservice: SerialportService, private snackbar: MatSnackBar) {

  }

  ngOnInit(): void {
     this.serialservice.tankOneSubject.subscribe(val => { this.updateTankOne(val); });
     this.serialservice.tankTwoSubject.subscribe(val => { this.updateTankTwo(val); });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
      width: '1200px',
      height: '550px',
      data: {tankOneName: this.tankOneName , tankOnePower: this.tankOnePower, tankTwoName: this.tankTwoName,
         tankTwoPower: this.tankTwoPower, tankOneColor: this.tankOneColor, tankTwoColor: this.tankTwoColor
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.tankOneName = result.tankOneName;
      this.tankTwoName = result.tankTwoName;
      this.tankOnePower = result.tankOnePower;
      this.tankTwoPower = result.tankTwoPower;
      this.tankOneColor = result.tankOneColor;
      this.tankTwoColor = result.tankTwoColor;
      this.printTankData();
    });

   }


  printTankData() {
    console.log('Tank One Name: ' + this.tankOneName);
    console.log('Tank Two Name: ' + this.tankTwoName);
    console.log('Tank One Power ' + this.tankOnePower);
    console.log('Tank Two Power: ' + this.tankTwoPower);
    console.log('Tank One Color ' + this.tankOneColor);
    console.log('Tank Two Color: ' + this.tankTwoColor);
  }
  updateTankOne(healthObj: any ) {
      const num = healthObj['health'];
      console.log(num);
      if (num <= 0) {
        this.tankTwoWins();
      }
      this.tankOneValue = num;
  }

  updateTankTwo(healthObj: any ) {
    const num = healthObj['health'];
    console.log(num);
    if (num <= 0) {
      this.tankOneWins();
    }
    this.tankTwoValue = num;
  }


  initTanks() {
    this.initTankOne();
    this.initTankTwo();
    this.serialservice.activate();
  }

  initTankOne() {
    let powType = -3;
    let colorType = -3;

    if (this.tankOnePower === 'moreHealth') {
      powType = 3;
    } else if (this.tankOnePower === 'fastMove') {
      powType = 1;
    } else if (this.tankOnePower === 'fastAim') {
      powType = 2;
    }

    if (this.tankOneColor === 'green') {
      colorType = 1;
    } else if (this.tankOneColor === 'blue') {
      colorType = 2;
    } else if (this.tankOneColor === 'purple') {
      colorType = 3;
    } else if (this.tankOneColor === 'teal') {
      colorType = 4;
   }


    if (powType < 0) {
      console.log('ERROR: no power choice for tank one!');
      return;
    }
    if (colorType < 0) {
      console.log('ERROR: no color choice for tank one!');
      return;
    }

    const setup: Setup = { type: powType, color: colorType };
    this.serialservice.sendSetupTankOne(setup).subscribe((val) => console.log(val) );
  }

  initTankTwo() {
    let powType = -3;
    let colorType = -3;

    if (this.tankTwoPower === 'moreHealth') {
      powType = 1;
    } else if (this.tankTwoPower === 'fastMove') {
      powType = 3;
    } else if (this.tankTwoPower === 'fastAim') {
      powType = 2;
    }


    if (this.tankTwoColor === 'green') {
      colorType = 1;
    } else if (this.tankTwoColor === 'blue') {
      colorType = 2;
    } else if (this.tankTwoColor === 'purple') {
      colorType = 3;
    } else if (this.tankTwoColor === 'teal') {
      colorType = 4;
  }


    if (powType < 0) {
      console.log('ERROR: no power choice for tank two!');
      return;
    }
    if (colorType < 0) {
      console.log('ERROR: no color choice for tank two!');
      return;
    }

    const setup: Setup = { type: powType, color: colorType };
    this.serialservice.sendSetupTankTwo(setup).subscribe((val) => console.log(val) );
  }

  startConnection() {
    console.log('hi');
     // this.serialservice.getTankOneHealth('yeet').subscribe((val) => console.log(val) );
    //  this.serialservice.activate();
    this.initTanks();
  }

  tankOneWins() {
    const dialogRef = this.dialog2.open(WinnerDialogComponent, {
      width: '460px',
      height: '100px',
      data: { winner: this.tankOneName }
    });
  }

  tankTwoWins() {
    const dialogRef = this.dialog2.open(WinnerDialogComponent, {
      width: '460px',
      height: '100px',
      data: { winner: this.tankTwoName }
    });

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
    this.data.tankOneName = '';
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


@Component({
  selector: 'app-winner-dialog',
  templateUrl: 'winner-dialog.html',
})
export class WinnerDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<WinnerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WinnerData) {}

  ngOnInit() {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
