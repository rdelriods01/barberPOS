import { Component } from '@angular/core';
 
import { AuthService } from '../services/auth.service';
 
@Component({
  selector: 'usersC',
  templateUrl: '../views/users.html',
  styleUrls: ['../css/users.css']
})
export class UsersComponent {
 
    roles = ['user','admin'];
    displayName;
    email;
    password;
    rol;
    
    barbers;
  constructor(public _authService: AuthService) {
      this._authService.getBarbers().subscribe(barbers=>{
          this.barbers=barbers;
      })
  }
 
  nuevoUsuario(userData){
      if(userData.valid){
          console.log(userData.value);
          this._authService.createUser(userData.value);
      }
  }
 
  deleteUser(user){
    let res= confirm('Seguro que desea eliminar a: ' + user.displayName + '?');
    if(res==true){
      this._authService.deleteUser(user.uid)
        console.log(user.uid);        
    }else{
      alert('Usuario NO eliminado');
    } 
  }

}