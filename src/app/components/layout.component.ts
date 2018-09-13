import { Component } from '@angular/core';
import { Router } from '@angular/router';
 
import { AuthService } from '../services/auth.service';
 
@Component({
  selector: 'layoutC',
  templateUrl: '../views/layout.html',
  styleUrls: ['../css/layout.css']
})
export class LayoutComponent {
 
  showSideNav:Boolean=false;
  user;
 
  constructor(public auth: AuthService,
               public router: Router) {
    if(window.innerWidth<769){ this.showSideNav=false }
    this.auth.user.subscribe(us=>{
      if(us){
        this.user=us;
        if(us.role=='admin'){
          this.router.navigate(['/db']);
        }
      }
    })
  }
}