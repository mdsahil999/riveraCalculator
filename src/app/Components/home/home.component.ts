import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexLegend, ApexMarkers, ApexStroke, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListCalculation } from 'src/app/Models/list-calculation.model';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any; // ApexTooltip;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers:[DatePipe]
})
export class HomeComponent implements OnInit {
  public typeSelected: string = 'ball-fussion';
  public chartOptions: Partial<ChartOptions> = {};
  public chartOptions2: Partial<ChartOptions> = {};
  public editForm: FormGroup;
  public z: number = 0;
  public t: number = 0;
  public tmin: number = 0;
  public listOfCalculation: ListCalculation[] = [];
  public timeToShow: number = 0;
  public stepWiseToshow: number = 0;
  public netApyToShow: number = 0;
  public rangeValue: number = 0;
  public isDisplay: boolean = false;
  constructor(private fb: FormBuilder, private datePipe: DatePipe, private spinnerService: NgxSpinnerService) {
   this.intializeChartOption();
    this.editForm = this.fb.group({
      apr: [50, Validators.required],
      fees: [20, Validators.required],
      initialInvestment: [50000, Validators.required],
      investmentDuration: [24, Validators.required]
    });
   }

  public intializeChartOption(){
    this.chartOptions = {
      series: [
        // {
        //   name: "Session Duration",
        //   data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
        // },
        // {
        //   name: "Page Views",
        //   data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
        // }
      ],
      chart: {
        height: 350,
        type: "line"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 5,
        curve: "straight",
        dashArray: [0, 8, 5]
      },
      title: {
        text: "Original Amount vs Compounded Amount",
        align: "left"
      },
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        labels: {
          trim: false
        },
        categories: [
        ]
      },
      tooltip: {
        y: []
      },
      grid: {
        borderColor: "#f1f1f1"
      }
    };
    this.chartOptions2 = {
      series: [
        // {
        //   name: "Session Duration",
        //   data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
        // },
        // {
        //   name: "Page Views",
        //   data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
        // }
      ],
      chart: {
        height: 350,
        type: "line"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 5,
        curve: "straight",
        dashArray: [0, 8, 5]
      },
      title: {
        text: "Original APR vs Compounded APY",
        align: "left"
      },
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        labels: {
          trim: false
        },
        categories: [
        ]
      },
      tooltip: {
        // y: [
        //   {
        //     title: {
        //       formatter: function(val: string) {
        //         return val + " (mins)";
        //       }
        //     }
        //   },
        //   {
        //     title: {
        //       formatter: function(val: string) {
        //         return val + " per session";
        //       }
        //     }
        //   }
        // ]
      },
      grid: {
        borderColor: "#f1f1f1"
      }
    };
  }

  ngOnInit(): void {
    this.spinnerService.show();

    // setTimeout(() => {
    //   this.spinnerService.hide();
    // }, 2000);
    this.calculation();
    //this.spinnerService.hide();
  }

  public calculation(): void{
    this.spinnerService.show();
    this.intializeChartOption();
    this.listOfCalculation = [];
    this.z = this.initialInvestment.value / (+this.fees.value);
    this.t = +(365 * (1 + Math.sqrt(1 + 8 * this.z))/(2 * this.z * (this.apr.value/100)));
    this.tmin = Math.ceil((this.investmentDuration.value * 30)/ this.t);
    if(this.tmin > 2){
      this.isDisplay = true;
      for(let i = 1;i<=this.tmin;i++) {
        let cmdAmnt = 0;
        let time = i * this.t;
        let orgAmnt = (this.initialInvestment.value * (1 + (this.apr.value/100) * (time/365)));
        if(i == 1){
        cmdAmnt = (this.initialInvestment.value * (1 + (this.apr.value/100) * (this.t/365))) - (+this.fees.value);
        }else{
          const index : number = i - 2;
          cmdAmnt = (this.listOfCalculation[index]?.compoundAmout * (1 + (this.apr.value/100) * (this.t/365))) - (+this.fees.value);
        }
        let stpWise = cmdAmnt - this.initialInvestment.value + (+this.fees.value);
        let orgApr = this.apr.value;
        let ntApy = (((cmdAmnt - this.initialInvestment.value)*365/time)/this.initialInvestment.value) * 100;
        this.listOfCalculation.push({time: time, orginalAmout: orgAmnt, compoundAmout: cmdAmnt, stepwiseH:stpWise, orginalArp: orgApr, netApy:ntApy})
      }

     this.timeToShow = this.listOfCalculation[0].time;
     this.stepWiseToshow = this.listOfCalculation[0].stepwiseH;
     this.netApyToShow = this.listOfCalculation[this.listOfCalculation.length - 1].netApy;
      console.log("this.listOfCalculation", this.listOfCalculation);
     this.chartOptions.series = [
      {name:"Compounded Amount",data:this.listOfCalculation.map(e => +e.compoundAmout.toFixed(2))},
      {name:"Original Amount",data:this.listOfCalculation.map(e => +e.orginalAmout.toFixed(2))},
    ];
    const a = this.listOfCalculation.map(e => this.addDays(+e.time.toFixed(1)));
    console.log("xaxis", this.listOfCalculation.map(e => this.addDays(+e.time.toFixed(1))));
    (this.chartOptions.xaxis as ApexXAxis).categories = a;
    this.chartOptions2.series = [
      {name:"Compounded APY",data:this.listOfCalculation.map(e => +e.netApy.toFixed(2))},
      {name:"Original APR",data:this.listOfCalculation.map(e => +e.orginalArp.toFixed(2))}
    ];
    (this.chartOptions2.xaxis as ApexXAxis).categories = a;
    }else{
      this.isDisplay = false;
    }
    this.spinnerService.hide();
   console.log("this.listOfCalculation", this.listOfCalculation);
   console.log("this.chartOptions", this.chartOptions);
   console.log("this.chartOptions2", this.chartOptions2);
   this.spinnerService.hide();
  }

  public submit(): void {
    this.spinnerService.show();
    setTimeout(() => {
      this.calculation();
    }, 100);

    //this.spinnerService.hide();
  }

  public get apr(): AbstractControl {
    return this.editForm.get('apr') as AbstractControl;
  }

  public get fees(): AbstractControl {
    return this.editForm.get('fees') as AbstractControl;
  }

  public get investmentDuration(): AbstractControl {
    return this.editForm.get('investmentDuration') as AbstractControl;
  }

  public get initialInvestment(): AbstractControl {
    return this.editForm.get('initialInvestment') as AbstractControl;
  }

  getRange(event: any){
    this.investmentDuration.patchValue(event.target.value);
    //this.rangeValue = event.target.value;
   }

   addDays(days : number): any{
    var futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return this.datePipe.transform(futureDate,'mediumDate');
  }

}
