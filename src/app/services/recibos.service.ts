import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { Observable } from 'rxjs';

import { IRecibo } from '../models/interfaces';

@Injectable()

export class ReciboService{
    
    // recibos:Observable<IRecibo[]>;
    recibos:any;

    constructor( public afs: AngularFirestore){
    } 

    // Agregar Nuevo Recibo
    saveRecibo (recibo:IRecibo){
        recibo.uid=this.afs.createId();
        this.afs.collection('recibos').doc(recibo.uid).set(recibo);
    }
    // Leer todos los recibos (90 dias)
    getRecibos(){
        let fechalimite= new Date(this.getDias(90));
        let fechalimiteTS=fechalimite.getTime();
        return this.recibos=this.afs.collection('recibos', ref => ref.where('fecha', '>=', fechalimiteTS).orderBy('fecha', "desc")).valueChanges();
    }
    // Leer recibos recientes (3 dias)
    getRecibosRecientes(){
        let fechalimite= new Date(this.getDias(3));
        let fechalimiteTS=fechalimite.getTime();
        return this.recibos=this.afs.collection('recibos', ref => ref.where('fecha', '>=', fechalimiteTS).orderBy('fecha', "desc")).valueChanges();
    }
    // Leer un recibo en específico   
    getUnRecibo(uidR){
        return this.afs.collection('recibos').doc(uidR).valueChanges();
    }
    // Leer todos los recibos
    getTodosRecibos(){
        return this.recibos=this.afs.collection('recibos', ref => ref.orderBy('fecha', "desc")).valueChanges();
    }
    // Actualizar Recibo
    updateRecibo(rec:IRecibo){
        this.afs.collection('recibos').doc(rec.uid).update(rec);
    }
    // Eliminar Recibo
    deleteRecibo(uidR){
        this.afs.collection('recibos').doc(uidR).delete();
        alert('Recibo eliminado!');
    }


    getDias(v){
        var d=new Date();
        d.setDate(d.getDate() - v);
        let miFecha:any[]=[];
        miFecha[0]=d.getFullYear();
        miFecha[1]=d.getMonth()+1;
        miFecha[2]=d.getDate();
        let tresDias=miFecha[0]+'-'+miFecha[1]+'-'+miFecha[2];
        return tresDias;    
    }
}