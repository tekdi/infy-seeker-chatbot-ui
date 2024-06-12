import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-get-assist',
  templateUrl: './get-assist.component.html',
  styleUrl: './get-assist.component.css'
})
export class GetAssistComponent {
  userInput: string = '';
  searchResult: any;
  constructor(private http: HttpClient) {}
  search() {
    const requestData = {
      title: this.userInput
     
    };

    this.http.post<any>('http://localhost:3000/search', requestData).subscribe(
      (response) => {
        this.searchResult = response;
        console.log(this.searchResult);
      },
      (error) => {
        console.error('Error:', error);
        // Handle error
      }
    );
  }
}
