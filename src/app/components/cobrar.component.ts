import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { ReciboService } from "../services/recibos.service";

import { IRecibo } from '../models/interfaces';

@Component({
  selector: 'cobrarC',
  templateUrl: '../views/cobrar.html',
  styleUrls: ['../css/cobrar.css']
})
export class CobrarComponent {

recibo= {} as IRecibo;
total;
porpagar;
cambio;
pagacon:string;
formaDePago='efectivo';
tipoDeTarjeta='visamastercard';
digitos;
autorizacion;
// Variables para los Estilos
porpagarColor;
cambioColor;
cambioFontSize;

    constructor( public _reciboService:ReciboService,
                 public dialogRef:MatDialogRef<CobrarComponent> ){        
    } 

    ngOnInit(){
        this.total=Number(this.recibo.total);
        this.pagacon='';

        

    }

    calcular(){
        this.porpagar=this.total-Number(this.pagacon);
            if(this.porpagar<=0){
                this.porpagar=0;
                this.porpagarColor='gray';
            }else{
                this.porpagarColor='#f44336';
            }
        this.cambio=Number(this.pagacon)-this.total;
            if(this.cambio<=0){
                this.cambio=0;
                this.cambioColor='gray';
                this.cambioFontSize='1em';
            }else{ 
                this.cambioColor='#2196f3';
                this.cambioFontSize='2em';
            }
    }


    sendNum(v){
        if(this.pagacon==''){
            if(v=='back' || v=='clear' || v=='.' || v=='0' || v=='00' ){
                this.pagacon='';
            }else{
                this.pagacon=this.pagacon+v;
            }
        }else{
            if(v=='back'){
                this.pagacon=this.pagacon.substring(0, this.pagacon.length-1);
            }else{
                if(v=='clear'){
                    this.pagacon='';
                }else{
                    this.pagacon=this.pagacon+v;
                }
            }
        }
        this.calcular();

    }
    reset(){
        this.pagacon='';
        this.digitos='';
        this.autorizacion='';
    }

    sendTicket(){
        this.recibo.folio= Date.now().toString();
        this.recibo.formadepago=this.formaDePago;
        if(this.formaDePago=='efectivo'){
            this.recibo.efectivo=this.pagacon;
            this.recibo.cambio=this.cambio.toString();
        }
        if(this.formaDePago=='tarjeta'){
            this.recibo.tipodetarjeta=this.tipoDeTarjeta;
            this.recibo.digitos=this.digitos;
            this.recibo.autorizacion=this.autorizacion;
        }
        console.log(this.recibo);
        this._reciboService.saveRecibo(this.recibo);
        let result={data:this.recibo, flag:'sended'}
        this.dialogRef.close(result);
    }
}