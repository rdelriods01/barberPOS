import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { timer } from 'rxjs';

@Component({
  selector: 'loginC',
  templateUrl: '../views/login.html',
  styleUrls: ['../css/login.css']
})
export class LoginComponent {

  email: string;
  pass: string;
  backgrounds = new Array(
    "url('../../assets/walls/1.jpg')",
    "url('../../assets/walls/2.jpg')",
    "url('../../assets/walls/3.jpg')",
    "url('../../assets/walls/4.jpg')",
    "url('../../assets/walls/5.jpg')"
  );
  timer;
  current = 0;

  constructor(public auth: AuthService) {
    this.pass = '';
  }

  ngOnInit() {
    this.timer = setInterval(() => { this.nextBackground() }, 3000);
    this.auth.user.subscribe(us => {
      if (us != null) {
        clearInterval(this.timer)
      }
    })
  }

  nextBackground() {
    this.current++;
    this.current = this.current % this.backgrounds.length;
    let bg = document.getElementById('bg');
    if (bg) { bg.style.backgroundImage = this.backgrounds[this.current] }
  }

  login(e, p) {
    this.auth.login(e, p);
  }

  sendNum(v) {
    this.pass = this.pass + v;
    if (this.pass.length == 6) {
      let flag = false;
      let user;

      this.auth.getUsers().subscribe(uss => {
        uss.forEach(us => {
          if (this.pass == us['password']) {
            user = us;
            flag = true;
          }
        })

        if (flag == true) {
          this.login(user['email'], user['password']);
          console.log(this.pass);
          this.pass = '';
        } else {
          console.log('No existe usuario con el PIN ' + this.pass);
          alert('Intente de nuevo por favor');
          this.pass = '';
        }

      })
    }
    if (this.pass.length > 6) {
      this.pass = '';
      this.pass = this.pass + v;
      console.log(this.pass);
    }
  }

}
