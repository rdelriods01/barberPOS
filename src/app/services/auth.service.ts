import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EmailAuthProvider } from '@firebase/auth-types';

import { IUser } from '../models/interfaces';

@Injectable()
export class AuthService {

  user;

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router) {
    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.pipe(switchMap(us => {
      if (us) {
        return this.afs.doc(`users/${us.uid}`).valueChanges();
      } else {
        return of(null);
      }
    }))
  }

  login(email, pass): any {
    return this.afAuth.auth.signInWithEmailAndPassword(email, pass)
      .catch(err => {
        let msg = 'Something went wrogn: ' + err.message;
        alert(msg);
      });
  }

  createUser(us) {
    this.afAuth.auth.createUserWithEmailAndPassword(us.email, us.password)
      .then(data => {
        data.user.updateProfile({ displayName: us.displayName, photoURL: null })
          .then(() => {
            const miUser: IUser = {
              uid: data.user.uid,
              email: data.user.email,
              displayName: data.user.displayName,
              photoURL: data.user.photoURL,
              password: us.password,
              role: us.rol,
              lastlogin: data.user.metadata.lastSignInTime,
              created: data.user.metadata.creationTime
            };
            this.afs.doc(`users/${data.user.uid}`).set(miUser);
          })
      })
      .catch(err => {
        let msg = 'Something went wrogn: ' + err.message;
        alert(msg);
      });
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  getUsers() {
    return this.afs.collection('users').valueChanges();
  }
  getBarbers() {
    return this.afs.collection('users', ref => ref.where('role', '==', 'user')).valueChanges();
  }
  // Eliminar usuario
  deleteUser(uidU) {
    this.afs.collection('users').doc(uidU).delete();
    // this.afAuth.auth
    alert('Usuario eliminado!');
  }
}
