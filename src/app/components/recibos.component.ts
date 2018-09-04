import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';

import { AuthService } from '../services/auth.service';
import { ReciboService } from "../services/recibos.service";

import { TicketComponent } from "../components/ticket.component";

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
    displayedColumnsT: string[] = ['fecha', 'folio', 'cliente', 'articulos', 'total', 'acciones'];
    dataSourceT = new MatTableDataSource();
    @ViewChild(MatPaginator) paginatorT: MatPaginator;
    @ViewChild(MatSort) sortT: MatSort;  
    // Variable para admin
    showVerTodos=false;

    constructor( public _recibosS:ReciboService,
                 public dialog: MatDialog,
                 public auth: AuthService){
 
        this.auth.user.subscribe(us=>{
            if(us){
                if(us.role=='user'){
                    this._recibosS.getRecibosRecientes().subscribe(tickets=>{
                        console.log(tickets);
                        this.dataSourceT.data=tickets;
                        this.dataSourceT.paginator = this.paginatorT;
                        this.dataSourceT.sort = this.sortT;
                    })
                }else{
                    this.showVerTodos=true;
                    this._recibosS.getRecibos().subscribe(tickets=>{
                        console.log(tickets);
                        this.dataSourceT.data=tickets;
                        this.dataSourceT.paginator = this.paginatorT;
                        this.dataSourceT.sort = this.sortT;
                    })
                }
            }
        })
    }

    filtrarT(filterValue: string) {
        this.dataSourceT.filter = filterValue.trim().toLowerCase();
        if (this.dataSourceT.paginator) {
            this.dataSourceT.paginator.firstPage();
        }
    }

    verTicket(tkt){
        console.log(tkt);
        const dialogRef = this.dialog.open(TicketComponent)
        dialogRef.componentInstance.recibo=tkt;
    }

    verTodos(){
        this._recibosS.getTodosRecibos().subscribe(tickets=>{
            console.log(tickets);
            this.dataSourceT.data=tickets;
            this.dataSourceT.paginator = this.paginatorT;
            this.dataSourceT.sort = this.sortT;
        })
    }
}