import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { ClienteService } from "../services/clientes.service";

import {LayoutComponent  } from "../components/layout.component";

import { ICliente } from '../models/interfaces';

@Component({
  selector: 'clientesC',
  templateUrl: '../views/clientes.html',
  styleUrls: ['../css/clientes.css']
})
export class ClientesComponent {

  cliente= {} as ICliente;
  clientes;
  backupClientes;
  heightNewForm='0';
  opacityNewCForm='0';
  transitionNewForm='';
  showNewCliente=false;
  flagEditar=false;
  // Variables Productos
  displayedColumnsC: string[] = ['nombre','telefono','acciones'];
  dataSourceC = new MatTableDataSource();
  @ViewChild(MatPaginator) paginatorC: MatPaginator;
  @ViewChild(MatSort) sortC: MatSort;

  constructor(
    public _layoutC: LayoutComponent,
    public _clienteService: ClienteService
  ) {   
    this._clienteService.getClientes().subscribe(clientes=>{
      this.backupClientes=JSON.parse(JSON.stringify(clientes));
      this.clientes=clientes;
      this.dataSourceC.data=clientes;
      this.dataSourceC.paginator = this.paginatorC;
      this.dataSourceC.sort= this.sortC;
    })
  }
 
  showForm(){
    this.heightNewForm='6em';
    this.opacityNewCForm='1';
    this.transitionNewForm="all 1s";
  }

  hideForm(){
    this.reset();
    this.heightNewForm='0';
    this.opacityNewCForm='0';
    this.transitionNewForm="opacity 0.5s, height 1s";
  }

  guardarCliente(){
    if(this.flagEditar==true){
      this._clienteService.updateCliente(this.cliente);
    }else{
      delete this.cliente.uid;
      this._clienteService.saveCliente(this.cliente);
    }
    this.hideForm();
    this.reset();
  }
  reset(){
    this.cliente.nombre='';
    this.cliente.apellido='';
    this.cliente.telefono='';
    this.cliente.correo='';
    this.cliente.uid='';
    this.flagEditar=false;
  }
  filtrarC(filterValue: string) {
    this.dataSourceC.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceC.paginator) {
      this.dataSourceC.paginator.firstPage();
    }
  }

  editarCliente(cliente){
    this.showNewCliente=true;
    this.flagEditar=true;
    this.showForm();
    this.cliente=JSON.parse(JSON.stringify(cliente));
  }
  eliminarCliente(uidC){
    this._clienteService.deleteCliente(uidC);
  }

}