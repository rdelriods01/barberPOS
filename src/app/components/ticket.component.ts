import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { ClienteService } from "../services/clientes.service";

import { IRecibo } from '../models/interfaces';

@Component({
  selector: 'ticketC',
  templateUrl: '../views/ticket.html',
  styleUrls: ['../css/ticket.css']
})
export class TicketComponent {

    recibo:IRecibo;

    ngOnInit(){
        console.log(this.recibo);
    }
    ngAfterViewInit(){
        // window.print();
    }

}