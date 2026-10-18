import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';

interface Escenario {
  numero: number;
  precio:number;
  demanda: number;
  ganancia: number;
}
@Component({
  imports: [CommonModule, FormsModule, BaseChartDirective],
  standalone: true,
  selector: 'app-simulacion',
  styleUrl: './simulacion.css',
  templateUrl: './simulacion.html',

})
export class SimulacionComponent implements OnInit {

  costoProduccion: number =5.00;
  precioMin: number =6.00;
  precioMax: number= 8.00;
  demandaMin: number=800;
  demandaMax: number=1200;

  numeroSimulaciones: number =1000;

  gananciaPromedio: number =0;
  gananciaMaxima: number=0;
  gananciaMinima: number=0;
  probabilidad: number=0;

  resultados: Escenario[]=[];
  simulacionEjecutada: boolean =false;

  histogramData: any;
  histogramOptions: any={
    responsive: true,
    maintainAspectRatio: false,
    plugins:{
      legend:{dsiplay:false},
      tooltip:{enabled: true}

      },
      scales: {
    x: {
      ticks: { color: '#abb2bf' },
      grid: { color: '#282c34' }
    },
    y: {
      title:{ display: true, text:' N° de simulaciones'},
      ticks: { color: '#abb2bf' },
      grid: { color: '#282c34' }
    }
  }
      };
  

  ngOnInit(): void {
    this.ejecutarSimulacion();
  }
  ejecutarSimulacion(): void {
    this.resultados= [];
    let sumaGanancia=0;
    let contadorMenor100=0;

    for (let i=1; i<= this.numeroSimulaciones; i++){
      //FUNCION QUE GENERA NÚMERO AL AZAR
      const precioVenta = Math.random() * (this.precioMax - this.precioMin) +
      this.precioMin;
      //REDONDEA EL NUMERO HACIA ABAJO
      const demanda= Math.floor(Math.random() * (this.demandaMax - this.demandaMin + 1)) + this.demandaMin;

      const ganancia = (precioVenta - this.costoProduccion) * demanda;

      sumaGanancia += ganancia;
      
      if (ganancia < 1000){
        contadorMenor100++;
      }

      this.resultados.push({
        numero: i,
        precio: precioVenta,
        demanda: demanda,
        ganancia: ganancia
      });


      this.gananciaPromedio =sumaGanancia / this.numeroSimulaciones;
      //BUSCA EN AUTOMATICO LA GANANCIA MÁS ALTA Y MÁS BAJA
      this.gananciaMaxima =Math.max(...this.resultados.map(r => r.ganancia));
      this.gananciaMinima = Math.min(...this.resultados.map(r=>r.ganancia));
      this.probabilidad = (contadorMenor100 / this.numeroSimulaciones)*100;

      this.simulacionEjecutada=true;

      this.generarDatosGrafica();

    }

  }
  generarDatosGrafica(): void {
    const min = this.gananciaMinima;
    const max = this.gananciaMaxima;
    const numBins = 10;
    const step = (max - min) / numBins;

    const labels: string[] = [];
    const counts: number[] = new Array(numBins).fill(0);

    for (let i = 0; i < numBins; i++) {
      const binMin = min + i * step;
      const binMax = binMin + step;
      labels.push(`$${binMin.toFixed(0)} - $${binMax.toFixed(0)}`);
    }

    this.resultados.forEach(res => {
      let index = Math.floor((res.ganancia - min) / step);
      if (index >= numBins) index = numBins - 1;
      if (index < 0) index = 0;
      counts[index]++;
    });

    this.histogramData = {
      labels: labels,
      datasets: [{
        label: 'Frecuencia de Escenarios',
        data: counts,
        backgroundColor: '#ff79c6',
        borderColor: '#e06c75',
        borderWidth: 1,
        borderRadius: 6
      }]
    };
  }


}
