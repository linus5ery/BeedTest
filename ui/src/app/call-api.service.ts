import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CallApiService {

  private apiUrl = 'http://localhost:8080/api/v1/main'; // Replace with your API endpoint

  constructor(
    private http: HttpClient,
  ) { }

  replaceStudents(students: any): any {
    let promise = new Promise((res, rej) => {
      this.http.post<any>(`${this.apiUrl}/replaceStudents`, students).subscribe(
        (data) => {
          res(true);
        },
        (error) => {
          console.error('Error fetching students:', error);
          rej(false);
        }
      );
    });
    return promise;
  }
}
