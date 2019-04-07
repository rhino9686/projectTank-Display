import { Injectable } from '@angular/core';
import { Observable, Subject, interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cat } from '../models/cat';




@Injectable({
  providedIn: 'root'
})
export class SerialportService {
  subject: Subject<number>;
  timer: any;
  isActive = false;

  constructor(private http: HttpClient) { }

  activate(): void {
    this.isActive = true;
    this.timer = interval(1000);
    this.timer.pipe(this.subject);

    this.timer.subscribe(val => console.log(val));
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

  getTankOneHealth(name: string): Observable<Number> {
    return this.http.get<Number>(
      'http://localhost:8000/api/cats/'
    );
  }

}
