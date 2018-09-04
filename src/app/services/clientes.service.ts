import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { Observable } from 'rxjs';

import { ICliente } from '../models/interfaces';

@Injectable()

export class ClienteService{
    
    clientes:Observable<ICliente[]>;

    constructor( public afs: AngularFirestore){
    } 

    // Agregar Nuevo Cliente
    saveCliente (cliente:ICliente){
        cliente.uid=this.afs.createId();
        console.log(cliente);
        this.afs.collection('clientes').doc(cliente.uid).set(cliente);
    }
    // Leer todos los clientes
    getClientes(){
        return this.clientes=this.afs.collection<ICliente>('clientes').valueChanges();
    }
    // Leer un cliente en específico   
    getUnCliente(uidC){
        return this.afs.collection('clientes').doc(uidC).valueChanges();
    }
    // Actualizar Cliente
    updateCliente(cli:ICliente){
        this.afs.collection('clientes').doc(cli.uid).update(cli);
    }
    // Eliminar Cliente
    deleteCliente(uidC){
        this.afs.collection('clientes').doc(uidC).delete();
        alert('Cliente eliminado!');
    }
}