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

  constructor(private http: HttpClient) { }

  activate(): void {
    this.isActive = true;
    this.tankOneTimer = interval(1000).subscribe(
      (val) => { this.getTankOneHealth('one').subscribe(
         (data) => {this.tankOneSubject.next(data);
        });
      });

     /* this.tankTwoTimer = interval(1000).subscribe(
        (val) => { this.getTankTwoHealth('two').subscribe(
           (data) => {this.tankTwoSubject.next(data);
          });
        });*/

  }

  getAllCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>('http://localhost:8000/api/cats');
  }

  getCat(name: string): Observable<Cat> {
    return this.http.get<Cat>('http://localhost:8000/api/cats/' + name);
  }

  insertCat(cat: Cat): Observable<Cat> {
    return this.http.post<Cat>('http://localhost:8000/api/cats/', cat);
  }


  updateCat(cat: Cat): Observable<void> {
    return this.http.put<void>(
      'http://localhost:8000/api/cats/' + cat.name,
      cat
    );
  }

  deleteCat(name: string) {
    return this.http.delete('http://localhost:8000/api/cats/' + name);
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

  sendSetupTankOne(setup: Setup): Observable<boolean> {
    return this.http.put<boolean>(
      'http://localhost:8000/api/tankOne/' + setup.type, setup );
  }

  sendSetupTankTwo(setup: Setup): Observable<boolean> {
    return this.http.put<boolean>(
      'http://localhost:8000/api/tankTwo/' + setup.type, setup );
  }


}
