import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent {

  constructor(private router: Router) {}

  backToHome(): void {
    this.router.navigate(['/']);
  }
  
  // ling todo: prevent user go to this page by url , check referral?
}
