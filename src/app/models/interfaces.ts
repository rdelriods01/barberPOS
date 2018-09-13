export interface IUser {
    uid: string;
    email: string;
    password:string;
    displayName: string;
    photoURL?: string;
    role:string;
    lastlogin?:string;
    created?:string;
}

export interface IServicio{
    uid?:string;
    descripcion:string;
    precio:string;
}

export interface IProducto{
    uid?:string;
    sku:string;
    nombre:string;
    categoria?:string;
    preciodecompra?:string;
    precio:string;
    photourl?:any;
}

export interface IRecibo{
    uid?:string;
    folio:string;
    fecha:Date;
    barber:string;
    elements:any;
    articulos:number;    
    subtotal:string;
    iva:string;
    total:string;
    cliente:string;
    clienteid:string;
    formadepago:string;
    efectivo?:string;
    cambio?:string;
    tipodetarjeta?:string;
    digitos?:string;
    autorizacion?:string;
}

export interface ICliente{
    uid?:string;
    nombre:string;
    apellido:string;
    telefono:string;
    correo?:string;
    categoria?:string;
}