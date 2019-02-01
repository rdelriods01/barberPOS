import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { IServicio } from '../models/interfaces';

@Injectable()

export class ServicioService {

  servicios: Observable<IServicio[]>;

  constructor(public afs: AngularFirestore) {
  }

  // Agregar Nuevo Servicio
  saveServicio(servicio: IServicio) {
    servicio.uid = this.afs.createId();
    console.log(servicio);
    this.afs.collection('servicios').doc(servicio.uid).set(servicio);
  }
  // Leer todos los servicios
  getServicios() {
    return this.servicios = this.afs.collection<IServicio>('servicios').valueChanges();
  }




  // getServicios() {
  //     return this.afs.collection('servicios').snapshotChanges()
  //     .map(arr => {
  //     return arr.map(snap => {
  //         const obj = snap.payload.doc.data() as IServicio;
  //         return obj;
  //     });
  //     })
  //     .map(res=>{
  //         // res, ya es un array de objetos
  //         this.servicios=res;
  //         return res;
  //     })
  // }
  // Leer un servicio en específico
  getUnServicio(uidS) {
    return this.afs.collection('servicios').doc(uidS).valueChanges();
  }
  // Actualizar Servicio
  updateServicio(serv: IServicio) {
    this.afs.collection('servicios').doc(serv.uid).update(serv);
  }
  // Eliminar Servicio
  deleteServicio(uidS) {
    this.afs.collection('servicios').doc(uidS).delete();
    alert('Servicio eliminado!');
  }
}
