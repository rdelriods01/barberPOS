import { Component } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { ServicioService } from '../services/servicios.service';
import { ProductoService } from '../services/productos.service';

import { IRecibo } from '../models/interfaces';

@Component({
  selector: 'ventaC',
  templateUrl: '../views/venta.html',
  styleUrls: ['../css/venta.css']
})
export class VentaComponent {

    backupServicios;
    servicios;
    backupProductos;
    productos;
    recibo; 

    showElimItems=false;
    columnsTicket="1fr 4fr 1fr 1fr";

    constructor( public _serviciosS:ServicioService,
                 public _productosS: ProductoService,
                 public auth: AuthService){
        //  Iniciar Recibo
        this.recibo = {} as IRecibo;
        this.auth.user.subscribe(us=>{
            this.recibo.barber=us.displayName;           
        })
        this.recibo.elements=[];
        this.recibo.articulos=0;
        this.recibo.total='0';
        this.recibo.subtotal='0';
        this.recibo.iva='0';
        this._serviciosS.getServicios().subscribe(misServs=>{
            this.backupServicios=misServs;
            this.servicios=JSON.parse(JSON.stringify(misServs))
        })
        this._productosS.getProductos().subscribe(misProds=>{
            this.backupProductos=misProds;
            this.productos=JSON.parse(JSON.stringify(misProds)); 
        })
    }
    
    moveItem(ev, el, tipo){
        if(tipo=='servicio'){
            el.panstyle="translateX(" + ev.deltaX + "px)";
        }
        if(tipo=='ticket'){
            el.panstyleT="translateX(" + ev.deltaX + "px)";
        }
        el.panreturn="none";
    }
    
    sendToTicket(el, tipo){
        if(tipo=='servicio'){
            el.panstyle="translateX(0)";
            el.panreturn="transform 1s ease-out";
            el.nombre=el.descripcion;
        }
        let flagYaExiste=false;
        // Para saber la cantidad
        for(let i=0; i < this.recibo.elements.length;i++){
            if(el.uid==this.recibo.elements[i].uid){
                flagYaExiste=true;
                el.cant=this.recibo.elements[i].cant+1;
                this.recibo.elements.splice(i,1);
            }
        }
        if(flagYaExiste==false){
            el.cant=1;
        }
        el.total=Number(el.precio)*el.cant;
        this.recibo.elements.push(el);
        this.recibo.articulos=0;
        this.recibo.total='0';
        for(let i=0; i < this.recibo.elements.length;i++){
            this.recibo.articulos=this.recibo.articulos+this.recibo.elements[i].cant;
            this.recibo.total=(Number(this.recibo.total)+Number(this.recibo.elements[i].total)).toFixed(2);
        }
        this.recibo.total=(Math.round(Number(this.recibo.total)*100)/100).toFixed(2);
        this.recibo.subtotal=Math.round(Number(this.recibo.total)/1.16).toFixed(2);
        this.recibo.iva=Math.round(Number(this.recibo.total)*0.16).toFixed(2);
        console.log(this.recibo);
    }

    showElimItemsBtn(){
        if(this.showElimItems==false){
            this.columnsTicket="1fr 1fr 4fr 1fr 1fr";
        }else{
            this.columnsTicket="1fr 4fr 1fr 1fr";
        }
        this.showElimItems=!this.showElimItems;
    }
    
    deleteItemFromTicket(el){
        el.panstyleT="translateX(0)";
        el.panreturn="transform 1s ease-out";
        // Para saber la cantidad
        for(let i=0; i < this.recibo.elements.length;i++){
            if(el.uid==this.recibo.elements[i].uid){
                if(this.recibo.elements[i].cant==1){
                    this.recibo.elements.splice(i,1);
                }else{
                    this.recibo.elements[i].cant--;
                    this.recibo.elements[i].total=this.recibo.elements[i].precio*this.recibo.elements[i].cant;
                }
            }
        }
        this.recibo.articulos=0;
        this.recibo.total='0';
        for(let i=0; i < this.recibo.elements.length;i++){
            this.recibo.articulos=this.recibo.articulos+this.recibo.elements[i].cant;
            this.recibo.total=(Number(this.recibo.total)+Number(this.recibo.elements[i].total)).toFixed(2);
        }
        if(this.recibo.articulos<1){
            this.columnsTicket="1fr 4fr 1fr 1fr";
            this.showElimItems=false;
        }
        this.recibo.total=(Math.round(Number(this.recibo.total)*100)/100).toFixed(2);
        this.recibo.subtotal=Math.round(Number(this.recibo.total)/1.16).toFixed(2);
        this.recibo.iva=Math.round(Number(this.recibo.total)*0.16).toFixed(2);
        console.log(this.recibo);
    }
    cancelarTicket(){
        this.recibo.elements=[];
        this.recibo.articulos=0;
        this.recibo.iva='0.00';
        this.recibo.subtotal='0.00';
        this.recibo.total='0.00';
        this.columnsTicket="1fr 4fr 1fr 1fr";
        this.showElimItems=false;
    }


    filtrarS(val:string){
        val=val.trim().toLowerCase();
        this.servicios=this.filterAllProperties(this.backupServicios,val);
    }
    filtrarP(val){
        val=val.trim().toLowerCase();
        this.productos=this.filterAllProperties(this.backupProductos,val);
    }
    filterAllProperties(array,value){
        var filtrado = [];
        for (var i=0; i<array.length;i++){
          var obj=JSON.stringify(array[i]);
          if(obj.toLowerCase().indexOf(value)>=0){
            filtrado.push(JSON.parse(obj));
          }
        }
        return filtrado;
      }

}