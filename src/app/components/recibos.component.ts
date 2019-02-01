import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';

import { ReciboService } from "../services/recibos.service";

import { TicketComponent } from "../components/ticket.component";
import {LayoutComponent  } from "../components/layout.component";

import { IRecibo } from '../models/interfaces';

@Component({
  selector: 'recibosC',
  templateUrl: '../views/recibos.html',
  styleUrls: ['../css/recibos.css']
})
export class RecibosComponent {

     // Variables Recibos
    descripcionT;
    precioT;
    displayedColumnsT;
    dataSourceT = new MatTableDataSource();
    @ViewChild(MatPaginator) paginatorT: MatPaginator;
    @ViewChild(MatSort) sortT: MatSort;  
    // Variable para admin
    showVerTodos=false;

    constructor( public _recibosS:ReciboService,
                 public dialog: MatDialog,
                public _layoutC: LayoutComponent){
                
        if(this._layoutC.user.role=='user'){
            this.displayedColumnsT = ['fecha', 'folio', 'cliente', 'articulos', 'total', 'acciones'];
            this._recibosS.getRecibosRecientes(this._layoutC.user.displayName).subscribe(tickets=>{
                this.dataSourceT.data=tickets;
                this.dataSourceT.paginator = this.paginatorT;
                this.dataSourceT.sort = this.sortT;
            })
        }else{
            this.showVerTodos=true;
            this.displayedColumnsT = ['fecha', 'folio', 'cliente', 'articulos', 'total', 'barber','acciones'];
            this._recibosS.getRecibos(90).subscribe(tickets=>{
                this.dataSourceT.data=tickets;
                this.dataSourceT.paginator = this.paginatorT;
                this.dataSourceT.sort = this.sortT;
            })
        }
    }

    filtrarT(filterValue: string) {
        this.dataSourceT.filter = filterValue.trim().toLowerCase();
        if (this.dataSourceT.paginator) {
            this.dataSourceT.paginator.firstPage();
        }
    }

    verTicket(tkt){
        const dialogRef = this.dialog.open(TicketComponent)
        dialogRef.componentInstance.recibo=tkt;
    }

    verTodos(){
        this._recibosS.getTodosRecibos().subscribe(tickets=>{
            this.dataSourceT.data=tickets;
            this.dataSourceT.paginator = this.paginatorT;
            this.dataSourceT.sort = this.sortT;
        })
    }
}