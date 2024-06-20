// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// @Component({
//   selector: 'app-sign-up',
//   templateUrl: './sign-up.component.html',
//   styleUrls: ['./sign-up.component.css']
// })
// export class SignUpComponent {
//   fullname = '';
//   email = '';
//   password = '';

//   constructor(private http: HttpClient) {}

//   onSubmit() {
//     console.log("sign up ON Submit");
//     const user = { fullname: this.fullname ,email: this.email, password: this.password };
//     this.http.post('http://localhost:3000/signup', user).subscribe(response => {
//       console.log(response);
//     });
//   }
// }
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  fullname = '';
  email = '';
  password = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    console.log("sign up ON Submit");
    const user = { fullname: this.fullname ,email: this.email, password: this.password };
    this.http.post('http://localhost:3000/signup', user).subscribe(response => {
      const res: any = response; 

     
      if (res.message && res.message.length > 0) {
        alert(res.message); 
      }
       
      console.log(response);
    });
  }
}