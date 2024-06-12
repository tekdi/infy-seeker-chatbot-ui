import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  name = '';
  email = '';
  password = '';

  onSubmit() {
    // Implement sign-up logic here
  }
}