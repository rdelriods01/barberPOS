import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { ClienteService } from "../services/clientes.service";

import { ICliente } from '../models/interfaces';

@Component({
  selector: 'buscaragregarclienteC',
  templateUrl: '../views/buscaragregarcliente.html',
  styleUrls: ['../css/buscaragregarcliente.css']
})
export class BuscarAgregarClienteComponent {

  cliente= {} as ICliente;
  clientes;
  backupClientes;
  showTable=false;
  heightNewForm='0';
  opacityNewCForm='0';
  transitionNewForm='';

  constructor(
    public dialogRef: MatDialogRef<BuscarAgregarClienteComponent>,
    // @Inject(MAT_DIALOG_DATA) public cliente:ICliente,
    public _clienteService: ClienteService
  ) {
    console.log(this.cliente);
    
    this._clienteService.getClientes().subscribe(clientes=>{
      this.backupClientes=JSON.parse(JSON.stringify(clientes));
      this.clientes=clientes;
    })
  }

  showForm(){
    this.heightNewForm='6em';
    this.opacityNewCForm='1';
    this.transitionNewForm="all 1s"
  }
  hideForm(){
    this.heightNewForm='0';
    this.opacityNewCForm='0';
    this.transitionNewForm="opacity 0.5s, height 1s"

  }
  agregarCliente(){
    this.heightNewForm='0';
    this.opacityNewCForm='0';
    this.transitionNewForm="opacity 0.5s, height 1s"
    this._clienteService.saveCliente(this.cliente);
  }

  filtrarC(val){
    this.showTable=true;
    val=val.trim().toLowerCase();
    this.clientes=this.filterAllProperties(this.backupClientes,val);
    if(val==''){this.showTable=false}
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


  onNoClick(){
    this.cliente.nombre='Público en General';
    this.cliente.apellido='';
    this.cliente.telefono='';
    this.cliente.correo='';
    this.dialogRef.close(this.cliente);
  }

}