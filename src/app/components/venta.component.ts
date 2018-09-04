import { Component } from '@angular/core';
import {MatDialog } from '@angular/material';

import { AuthService } from '../services/auth.service';
import { ServicioService } from '../services/servicios.service';
import { ProductoService } from '../services/productos.service';
import { ReciboService } from "../services/recibos.service";
import { IRecibo, ICliente } from '../models/interfaces';

import { BuscarAgregarClienteComponent } from "../components/buscaragregarcliente.component";
import { CobrarComponent } from "../components/cobrar.component";
import { TicketComponent } from "../components/ticket.component";

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
    recibo = {} as IRecibo; 

    showElimItems=false;
    columnsTicket="1fr 4fr 1fr 1fr";

    cliente= {} as ICliente;

    constructor( public _recibosS: ReciboService,
                 public _serviciosS:ServicioService,
                 public _productosS: ProductoService,
                 public _authS: AuthService,
                 public dialog: MatDialog){
        // IniciarCliente
        this.cliente.nombre='Público en General';
        this.cliente.uid='XAXX010101000';
        //  Iniciar Recibo
        this._authS.user.subscribe(us=>{
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
    }
    cancelarTicket(){
        this.recibo.elements=[];
        this.recibo.articulos=0;
        this.recibo.iva='0.00';
        this.recibo.subtotal='0.00';
        this.recibo.total='0.00';
        this.columnsTicket="1fr 4fr 1fr 1fr";
        this.showElimItems=false;
        this.cliente.nombre='Público en General';
        this.cliente.apellido='';
        this.cliente.telefono='';
        this.cliente.correo='';
        this.cliente.uid='XAXX010101000';
        // this.cliente.categoria='';
        
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

    //   DIALOG para buscar o agregar clientes
    openClientes(){
        const dialogRef = this.dialog.open(BuscarAgregarClienteComponent, {
            width: '200em',
        });
      
        dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if(result){
            this.cliente = result;
        }
        console.log(this.cliente);
        
        });
    }

    openCobrar(){
        let ticket = JSON.parse(JSON.stringify(this.recibo))
        for(let i=0; i < ticket.elements.length;i++){
            delete ticket.elements[i].descripcion;
            delete ticket.elements[i].panreturn;
            delete ticket.elements[i].panstyle;
        }
        ticket.cliente=this.cliente.nombre;
        ticket.clienteid=this.cliente.uid;
        ticket.fecha=new Date();
        ticket.fecha=ticket.fecha.getTime();
        const dialogRef = this.dialog.open(CobrarComponent)
        dialogRef.componentInstance.recibo=ticket;
        dialogRef.afterClosed().subscribe(result=>{
            if(result.flag=='sended'){
                this.cancelarTicket();
                let dialogTicket = this.dialog.open(TicketComponent);
                dialogTicket.componentInstance.recibo=result.data;
            }
        })
    }
}