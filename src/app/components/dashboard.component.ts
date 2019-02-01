import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Chart } from 'chart.js';
import 'chartjs-plugin-datalabels';

import { ReciboService } from "../services/recibos.service";

 
@Component({
  selector: 'dashboardC',
  templateUrl: '../views/dashboard.html',
  styleUrls: ['../css/dashboard.css']
})
export class DashboardComponent {
  fechaini;
  fechafin;

  tickets;
  backupTickets;
  ventasRealizadas;
  totalDeVentas;
  barbers;
  selectedBarber;
  showBarber=true;
  columnsOps="repeat(6, 1fr)";

  tipoChart='bar';
  barChart=[];
  pieChart=[];
  chartFechas;
  chartVentas;
  arrVentasBarbers:number[];
  arrArtsBarbers:number[];
  chartBarbers;
  heightPie='auto';
  opacityPie='1';
  displayPie="grid";

  constructor(
    public _recibosS:ReciboService){
         // Inicia el cálculo desde el primer dia del mes en curso
      this.setMes();
  }
  setMes(){
    var d=new Date();
    d.setDate(1);
    this.fechaini= this.convToDate(d);
    this.fechafin=new Date();
    this.setRango();
  }
  setHoy(){
    var d=new Date();
    d.setDate(d.getDate());
    this.fechaini= this.convToDate(d);
    this.fechafin=new Date();
    this.setRango();
  }
  sendDateI(ev){
    this.fechaini=ev;
    this.fechafin=ev;   
  }
  sendDateF(ev){
    this.fechafin=ev;
  }
  setRango(){
    let inicio=this.fechaini.getTime();
    var d=new Date(this.fechafin);
    let ffin= this.convToDate(d);
    let fin=ffin.getTime()+86399999;
    if(fin<=inicio){
      alert("Las chartFechas están erroneas, favor de verificar");
    }else{
      // Valores iniciales
      this.barbers=["Todos"];
      this.selectedBarber=this.barbers[0];
      this._recibosS.getRangoRecibos(inicio, fin).subscribe(tkts=>{
        this.tickets=tkts;
        this.backupTickets=JSON.parse(JSON.stringify(tkts));
        // Buscar barbers
        tkts.forEach(tkt=>{
          if(this.barbers.length==0){
            this.barbers.push(tkt['barber']);
          }else{
            for(let i=0; i<this.barbers.length;i++){
              if(tkt['barber']==this.barbers[i]){
                this.barbers.splice(i,1);
              }
            }
            this.barbers.push(tkt['barber']);
          }
        })
        this.calcVentas(tkts);
      })
    }
  }

  setBarber(barb){
    if(barb=='Todos'){
      this.tickets=this.backupTickets;
      this.showBarber=true;
      this.columnsOps="repeat(6, 1fr)";
      this.heightPie='auto';
      this.opacityPie='1';
      this.displayPie="grid";
    }else{
      this.showBarber=false;
      this.columnsOps="repeat(5, 1fr)";
      this.tickets=this.filterByProperty(this.backupTickets,"barber",barb.toLowerCase());
      this.heightPie='0';
      this.opacityPie='0';
      this.displayPie="flex";
    }
    this.calcVentas(this.tickets);
  }
  
  changeChart(){
    this.tipoChart=='bar'? this.tipoChart='line':this.tipoChart='bar';
    this.calcVentas(this.tickets);
  }
  
  calcVentas(tkts){
    this.totalDeVentas=0;
    this.chartFechas=[];
    this.chartVentas=[];
    this.ventasRealizadas=tkts.length;
    this.chartBarbers=JSON.parse(JSON.stringify(this.barbers));
    this.chartBarbers.shift();
    this.arrVentasBarbers = new Array(this.chartBarbers.length);
    this.arrArtsBarbers = new Array(this.chartBarbers.length);
    for(let j=0;j<this.arrVentasBarbers.length;j++){
      this.arrVentasBarbers[j]=Number('0');
    }
    for(let j=0; j<this.arrArtsBarbers.length;j++){
      this.arrArtsBarbers[j]=0;
    }
    for(let i=0;i<tkts.length;i++){
      this.totalDeVentas=this.totalDeVentas+Number(tkts[i]['total']);
      // para los labels del chart, fechas
      let f1= new Date();
      f1.setTime(tkts[i]['fecha']);
      let fechaConvertida =this.convToDate(f1).toLocaleDateString('es-LA', { year: 'numeric', month: 'short', day: 'numeric' });
      this.chartVentas.push(Number(tkts[i]['total']));
      if(this.chartFechas.length==0){
        this.chartFechas.push(fechaConvertida);
      }else{
        // this.chartVentas.push(Number(tkts[i]['total']));
        for(let j=0; j<this.chartFechas.length;j++){
          if(fechaConvertida==this.chartFechas[j]){
            this.chartFechas.splice(j,1);
            let totalAnterior=this.chartVentas[j];
            this.chartVentas.splice(j,1);
            this.chartVentas[j]=totalAnterior+Number(tkts[i]['total']);
          }
        }      
        this.chartFechas.push(fechaConvertida);
      }
      // Total de cada barber
      for(let j=0;j<this.chartBarbers.length;j++){       
        if(tkts[i]['barber']==this.chartBarbers[j]){          
          this.arrVentasBarbers[j]=this.arrVentasBarbers[j]+Number(tkts[i]['total']);
          this.arrArtsBarbers[j]++;
        }
      }
    }
    this.chartFechas.reverse();
    this.chartVentas.reverse();
    if(this.barChart){
      let container = document.getElementById('barCanvasCont');
      let oldInstance = document.getElementById('barCanvas');
      if(oldInstance){
        container.removeChild(oldInstance);
      }
      let newInstance = document.createElement("canvas");
      newInstance.setAttribute("id", "barCanvas");
      if(container){
        container.appendChild(newInstance);
      }
    }
    if(this.pieChart){
      let container = document.getElementById('pieCanvasCont');
      let oldInstance = document.getElementById('pieCanvas');
      if(oldInstance){
        container.removeChild(oldInstance);
      }
      let newInstance = document.createElement("canvas");
      newInstance.setAttribute("id", "pieCanvas");
      if(container){
        container.appendChild(newInstance);
      }
    }
    this.barChart = new Chart('barCanvas', {
      type: this.tipoChart,
      data: {
        labels: this.chartFechas,
        datasets: [
          { 
            data: this.chartVentas,
            backgroundColor: "#3cba9f",
            borderColor:"#3cba9f",
            label:'total',
            fill:false,
            datalabels: {
              align: 'top',
              anchor: 'end'
            }
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true
              },
              offset:true
          }]
        },
        plugins: {
          datalabels: {
            formatter: function(value) {
              return '$'+value;
            }
          }
        }
      }
    });   
    this.pieChart = new Chart('pieCanvas', {
      type: 'doughnut',
      data: {
        labels: this.chartBarbers,
        datasets: [
          { 
            data: this.arrVentasBarbers,
            label:'total',
            backgroundColor:['#e57373','#81c784','#4fc3f7','#fff176']
          }
        ]
      },
      options: {
        legend: {
          display: true,
          position: 'right'
        },
        plugins: {
          datalabels: {
            formatter: function(value) {
              return '$'+value;
            }
          }
        }
      }
    })
  }

  convToDate(time){
    var d=new Date(time);
    let arrF:any[]=[];
    arrF[0]=d.getFullYear();
    arrF[1]=d.getMonth()+1;
    arrF[2]=d.getDate();
    let mifecha= new Date(arrF[0]+'-'+arrF[1]+'-'+arrF[2]);
    return mifecha;
  }

  filterByProperty(array, prop, value){
    var filtered = [];
    for(var i = 0; i < array.length; i++){
        var obj = array[i];
        if(obj[prop].toLowerCase().indexOf(value)>=0){
                filtered.push(obj);
        }
    }   
    return filtered;
  }
}