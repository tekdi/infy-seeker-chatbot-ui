import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FlaskService {
  private endpoint = 'http://127.0.0.1:5000/process';

  constructor(private http: HttpClient) { }

  postQuery(query: string) {
    const body = { query };
    console.log(body)
    return this.http.post<any>(this.endpoint, body);
  }
}
