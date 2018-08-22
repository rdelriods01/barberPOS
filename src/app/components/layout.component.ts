import { Component } from '@angular/core';
import { Router } from '@angular/router';
 
import { AuthService } from '../services/auth.service';
 
@Component({
  selector: 'layoutC',
  templateUrl: '../views/layout.html',
  styleUrls: ['../css/layout.css']
})
export class LayoutComponent {
 
  showSideNav:Boolean=true;
  user;
 
  constructor(public auth: AuthService) {
    if(window.innerWidth<769){ this.showSideNav=false }
    this.auth.user.subscribe(us=>{
      this.user=us;
    })
  }
}