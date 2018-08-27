import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { ServicioService } from '../services/servicios.service';
import { ProductoService } from '../services/productos.service';

@Component({
  selector: 'prodyservC',
  templateUrl: '../views/prodyserv.html',
  styleUrls: ['../css/prodyserv.css'],
  animations: [
    trigger('animationNewServ', [      
      transition(':enter', [style({ height: '0', opacity:'0', margin:'0' }), animate(400) ]),
      transition(':leave', [animate(400, style({ height: '0', opacity:'0', margin:'0' })) ]),
      state('*', style({ height: '*', opacity:'1', margin:'*' })), ])
    ]
  })
export class ProdYServComponent {

  // Variables Servicios
  showNewServ=false;
  descripcionS;
  precioS;
  displayedColumnsS: string[] = ['descripcion', 'precio', 'acciones'];
  dataSourceS = new MatTableDataSource();
  @ViewChild(MatPaginator) paginatorS: MatPaginator;
  @ViewChild(MatSort) sortS: MatSort;  
  // Variables Productos
  showNewProd=false;
  skuP;
  nombreP;
  precioP;
  displayedColumnsP: string[] = ['sku', 'nombre','precio','acciones'];
  dataSourceP = new MatTableDataSource();
  @ViewChild('paginatorP', {read:MatPaginator}) paginatorP: MatPaginator;
  @ViewChild('sortProductos', {read: MatSort}) sortP: MatSort;
  // @ViewChild(MatPaginator) paginatorP: MatPaginator;
  // @ViewChild(MatSort) sortP: MatSort;

  constructor( public _serviciosS:ServicioService,
              public _productosS: ProductoService){
    this._serviciosS.getServicios().subscribe(servs=>{
      this.dataSourceS.data=servs;
      this.dataSourceS.paginator = this.paginatorS;
      this.dataSourceS.sort = this.sortS;
    })
    this._productosS.getProductos().subscribe(prods=>{
      this.dataSourceP.data=prods;
      this.dataSourceP.paginator = this.paginatorP;
      this.dataSourceP.sort= this.sortP;
    })
  }

  filtrarS(filterValue: string) {
    this.dataSourceS.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceS.paginator) {
      this.dataSourceS.paginator.firstPage();
    }
  }
  filtrarP(filterValue: string) {
    this.dataSourceP.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceP.paginator) {
      this.dataSourceP.paginator.firstPage();
    }
  }

  eliminarServicio(d, idS){
    let res= confirm('Desea eliminar el servicio: ' + d + '?');
    if(res==true){
      this._serviciosS.deleteServicio(idS);
    }else{
      alert('Servicio NO eliminado');
    }    
  }
  eliminarProducto(n, idP){
    let res= confirm('Desea eliminar el producto: ' + n + '?');
    if(res==true){
      this._productosS.deleteProducto(idP);
    }else{
      alert('Producto NO eliminado');
    }    
  }

  guardarNuevoServicio(){
    console.log('Se guardo el nuevo Servicio: ' + this.descripcionS + ' a un precio de $' + this.precioS );
    this._serviciosS.saveServicio({descripcion:this.descripcionS, precio:this.precioS});
  }
  guardarNuevoProducto(){
    console.log('Se guardo el nuevo Producto: ' + this.nombreP + ' a un precio de $' + this.precioP );
    this._productosS.saveProducto({sku:this.skuP, nombre:this.nombreP, precio:this.precioP})
    
  }
 
}