import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from "rxjs";

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

  uploadPercent:Observable<number>;

  // Variables Servicios
  showNewServ=false;
  descripcionS;
  precioS;
  displayedColumnsS: string[] = ['descripcion', 'precio', 'acciones'];
  dataSourceS = new MatTableDataSource();
  @ViewChild(MatPaginator) paginatorS: MatPaginator;
  @ViewChild(MatSort) sortS: MatSort;
  servicios;
  // Variables Productos
  showNewProd=false;
  skuP;
  nombreP;
  precioP;
  displayedColumnsP: string[] = ['sku', 'nombre','precio', 'foto','acciones'];
  dataSourceP = new MatTableDataSource();
  @ViewChild('paginatorP', {read:MatPaginator}) paginatorP: MatPaginator;
  @ViewChild('sortProductos', {read: MatSort}) sortP: MatSort;
  productos;

  constructor( public _serviciosS:ServicioService,
              public _productosS: ProductoService,
              public storage: AngularFireStorage){
    this._serviciosS.getServicios().subscribe(servs=>{
      this.servicios=servs;
      this.dataSourceS.data=servs;
      this.dataSourceS.paginator = this.paginatorS;
      this.dataSourceS.sort = this.sortS;
    })
    this._productosS.getProductos().subscribe(prods=>{
      this.productos=prods;
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
    console.log(idP);
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
 
  subirFoto(event, prod){
    prod.showProgressBar=true;
    const file = event.target.files[0];
    const filePath = 'PIC-'+prod.uid;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath,file);
    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // download url
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url=>{
          prod.photourl = url;
          prod.showProgressBar=false;
          delete prod.showProgressBar;
          this._productosS.updateProducto(prod);
        })
       })
   )
  // .subscribe(url=>{
  //       console.log(url);
  //   })
  }

}