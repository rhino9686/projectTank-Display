import { Injectable } from '@angular/core';
import { Observable, Subject, interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cat } from '../models/cat';
import { Setup } from '../models/setup';



@Injectable({
  providedIn: 'root'
})

export class SerialportService {
  public tankOneSubject: Subject<number>;
  public tankTwoSubject: Subject<number>;

  tankOneTimer: any;
  tankTwoTimer: any;
  isActive = false;
  num: number;

  constructor(private http: HttpClient) {
    this.tankOneSubject = new Subject<number>();
    this.tankTwoSubject = new Subject<number>();
  }


  // Starts polling the server for tank health
  activate(): void {
    if ( this.isActive ) {
      return;
    }

    this.isActive = true;
    this.tankOneTimer = interval(1000).subscribe(
      (val) => { this.getTankOneHealth('one').subscribe(
         (data) => {this.tankOneSubject.next(data);
        });
      });

      this.tankTwoTimer = interval(1000).subscribe(
        (val) => { this.getTankTwoHealth('two').subscribe(
           (data) => {this.tankTwoSubject.next(data);
          });
        });

  }
  // Stops polling the server for tank health
  deactivate(): void {
    if (!this.isActive) {
      return;
    }
    this.tankOneTimer = null;
    this.tankTwoTimer = null;
    this.isActive = false;
  }


  getTankOneHealth(name: string): Observable<number> {
    return this.http.get<number>(
      'http://localhost:8000/api/tankOne/'
    );
  }

  getTankTwoHealth(name: string): Observable<number> {
    return this.http.get<number>(
      'http://localhost:8000/api/tankTwo/'
    );
  }

  sendSetupTankOne(setup: Setup): Observable<Setup> {
    console.log('attempting send');
    return this.http.post<Setup>(
      'http://localhost:8000/api/tankOne/setup/', setup );
  }

  sendSetupTankTwo(setup: Setup): Observable<boolean> {
    return this.http.put<boolean>(
      'http://localhost:8000/api/tankTwo/setup/', setup );
  }


}
