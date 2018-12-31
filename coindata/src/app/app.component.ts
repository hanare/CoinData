import { Component, OnInit } from '@angular/core';
import { BitCoinService } from './bitcoin.service';
import { BitCoinRate } from './bit-coin-rate';
import { Chart } from 'chart.js';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent,MatAutocompleteSelectedEvent} from '@angular/material';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CoinData';

  startDate = new Date(2017, 7, 17);
  endDate = new Date();

  bpiChart: Chart;
  showChart: boolean = true;
  updateTime: Date;
 bitCoinRates: BitCoinRate[];
  today = new Date();
  min = new Date(2017, 7, 17);




  myControl = new FormControl();
  options: string[] = ['INR', 'EUR', 'USD','JPY'];
  coinfilteredOptions: Observable<string[]>;




  constructor(private _bitcoinservice: BitCoinService,
    private _datepipe: DatePipe) {

  }
  ngOnInit() {

   

    this.bitCoinRates = new Array<BitCoinRate>();
    this._bitcoinservice.getHistoricalBIP().subscribe(data => {
      this.renderChart(data)
      
    });


    this.coinfilteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  getCurrencyRate($event:MatAutocompleteSelectedEvent){
    console.log("Console ",$event.option.value);
    let currency = $event.option.value;
    this._bitcoinservice.getCurrencPrice(currency).subscribe(data => {
      this.extraCoinPrice(data);
  });

  }

  currentPrice() {
    console.log("Current Price");

    this._bitcoinservice.getCurrentPrice().subscribe(data => {
        this.extraCoinPrice(data);
    });
  }

  uniqueCoins(value,index,self){

  }
  
  extraCoinPrice(data:any){
    console.log(data);
      let bpi = Object.values(data.bpi);
      console.log('bpi ', bpi);
      bpi.forEach(element => {
        let tmpRate: BitCoinRate = {
          currency: element["code"],
          symbol: element["symbol"],
          description: element["description"],
          rate: element["rate"],
          rate_float: element["rate_float"],
          timeUpdated: data.time.updated
        };
        console.log('  ', element);
        console.log("temp", tmpRate);
        this.bitCoinRates.push(tmpRate);
        this.bitCoinRates=this.bitCoinRates.filter((value,index,self)=>{
          return index===self.findIndex(data =>{
            return data.currency===value.currency;
          });
          
        });
       
      });
      this.updateTime = data.time.updated;
  }


  tabChanged($event) {
    console.log($event);

    if ($event.index == 1) {
      this.currentPrice();
    }
  }


  getHistoricalData(startDate: Date, endDate: Date) {
    let startdate = this._datepipe.transform(this.startDate, 'yyyy-MM-dd');
    let enddate = this._datepipe.transform(this.endDate, 'yyyy-MM-dd');

    console.log(startdate, " ---- ", enddate);
    this._bitcoinservice.getHistoricalBoundedBIP(startdate,enddate).subscribe(data=>{
        this.renderChart(data);
      

    })
  }

  displayChart(value: String, event: MatDatepickerInputEvent<Date>) {
    console.log(value, "Date selected ", event.value);
    if (value === 'startDate') {
      this.startDate = event.value;
    }
    else {
      this.endDate = event.value;
    } 
    if (this.endDate < this.startDate) {
      this.endDate = new Date();
    }
    console.log(this.endDate < this.startDate);
     
    console.log("Start date", this.startDate);
    console.log("End date ", this.endDate);
    this.getHistoricalData(this.startDate, this.endDate);
   
  }

  renderChart(data:any){
    let bpi_dates = new Array();
    let bpi_rates = new Array();
    
    // console.log("-----------------");
    let bpi = data.bpi;
    //console.log((bpi));
   
    Object.entries(bpi).forEach(([date, rate]) => {
      // console.log(date," ---",rate);
      let bpi_date = this._datepipe.transform(date, 'dd,MMM,yyyy');
      //console.log(bpi_date);

      bpi_dates.push(bpi_date);

      bpi_rates.push(Number(rate));

    });
    // console.log("data",bpi);

    this.updateTime = data.time.updated;

    this.bpiChart = new Chart('bpiCanvas', {
      type: 'line',
      title: "Historical bitcoin price Index",
      data: {
        labels: bpi_dates,
        defaultFontSize: 50,
        datasets: [
          {
            label: "Historical bitcoin price($)",
            data: bpi_rates,
            fill: false,
            borderColor: '#3cba9f'
          }
        ]
      },
      options: {
        tooltips: {
          callback: {
            afterLabel: function (tooltipItem, data) {
              return data + " $";
            }
          },

          enabled: true,

          bodyFontColor: '#000',
          bodyFontSize: 20,
          position: 'average',


        },
        legend: {
          display: false
        },

        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Dates',
              fontSize: 25
            },
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Dollar',
              fontSize: 25
            }
          }]
        }
      }
    });

  }
}
