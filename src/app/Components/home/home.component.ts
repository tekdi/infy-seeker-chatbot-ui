import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isHomePage: boolean = true;
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check initial route
    this.checkRoute();

    // Subscribe to router events to handle route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkRoute();
      }
    });
   
  }

  
  private checkRoute(): void {
    this.isHomePage = this.router.url === '/';
  }

  onLogout(): void {
    // Clear session storage

    sessionStorage.clear();
    console.log("In Logout")
    sessionStorage.setItem("isloggedIn","false");
    
    // Navigate to the login page or home page
    //this.router.navigate(['/']);
  }
}
