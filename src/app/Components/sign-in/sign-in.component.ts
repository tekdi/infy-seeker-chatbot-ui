import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  

  email: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}
  onSubmit() {
    const user = { email: this.email, password: this.password };
    this.http.post<{ message: string }>('http://localhost:3000/signin', user).subscribe(response => {
      console.log(response);
      if (response.message === "User signed in") {
        sessionStorage.setItem("isloggedIn", "true");
        alert("Sign in Successful");
      } else {
        sessionStorage.setItem("isloggedIn", "false");
        alert("Incorrect credentials");
      }
    }, error => {
      sessionStorage.setItem("isloggedIn", "false");
      alert("Incorrect credentials");
    });
  }
}
