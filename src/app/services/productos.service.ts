import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { IProducto } from '../models/interfaces';

@Injectable()

export class ProductoService {

  productos: Observable<IProducto[]>;

  constructor(public afs: AngularFirestore) {
  }

  // Agregar Nuevo Producto
  saveProducto(producto: IProducto) {
    producto.uid = this.afs.createId();
    console.log(producto);
    this.afs.collection('productos').doc(producto.uid).set(producto);
  }
  // Leer todos los productos
  getProductos() {
    return this.productos = this.afs.collection<IProducto>('productos').valueChanges();
  }
  // Leer un producto en específico
  getUnProducto(uidP) {
    return this.afs.collection('productos').doc(uidP).valueChanges();
  }
  // Actualizar Producto
  updateProducto(prod: IProducto) {
    this.afs.collection('productos').doc(prod.uid).update(prod);
  }
  // Eliminar Producto
  deleteProducto(uidP) {
    this.afs.collection('productos').doc(uidP).delete();
    alert('Producto eliminado!');
  }
}
