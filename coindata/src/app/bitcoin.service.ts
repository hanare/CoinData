import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BitCoinService {

  constructor(private  _http: HttpClient) { }

  getCurrentPrice():Observable<any>{

    let url='https://api.coindesk.com/v1/bpi/currentprice.json';
   
    return  this._http.get<any>(url);
  }

  getHistoricalBIP():Observable<any>{
    let url ='https://api.coindesk.com/v1/bpi/historical/close.json';
    return  this._http.get<any>(url);
  }

  getHistoricalBoundedBIP(startDate:String,endDate:String):Observable<any>{
    let url =`https://api.coindesk.com/v1/bpi/historical/close.json?start=${startDate}&end=${endDate}`;
    return  this._http.get<any>(url);
  }

  getCurrencPrice(currency: String):Observable<any>{
    let url =`https://api.coindesk.com/v1/bpi/currentprice/${currency}.json`;
    return  this._http.get<any>(url);
  }
}
