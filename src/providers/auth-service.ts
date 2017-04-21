import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, RequestMethod, Request } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export class User {

}
export class allOrders {

}

@Injectable()
export class AuthService {
  constructor(private http: Http) { }
  currentUser: any;
  orders: any;
  completedOrders: any;
  dateTime: any;
  head: any = Headers;

  mainUrl: any = "https://brownapron.com/";
  apiKey: any = "1QS7loinQ6X6Tft02K4y2CRAnXMTs4TG";

  URL: any = this.mainUrl + "ba/api/login?api-key=1QS7loinQ6X6Tft02K4y2CRAnXMTs4TG";
  ordersURL: any = this.mainUrl + "ba/api/listOrders?api-key=1QS7loinQ6X6Tft02K4y2CRAnXMTs4TG";
  cash: any = this.mainUrl + "ba/api/acceptingCash";
  completeOrderURL: any = this.mainUrl + "ba/api/updateOrderStatus";
  returnOrderURL: any = this.mainUrl + "ba/api/returnPartialOrder";

  public login(credentials) {
    if (credentials.username === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {

        this.http.get(this.URL + '&user_id=' + credentials.username + '&pin=' + credentials.password + '&time_stamp=2017')
          .map(res => res.json()).subscribe(
          data => {
            if (data.status === 100) {
              if (data.data.user_type == "DeliveryBoy") {
                this.currentUser = data;
                localStorage.setItem('currentUser', JSON.stringify(data));
                observer.next(true);
                observer.complete();
              } else {
                observer.next(false);
                observer.complete();
              }
            }
          },
          err => {
            observer.next(false);
            observer.complete();
          });


      });



    }
  }

  public register(credentials) {
    if (credentials.username === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  public getOrders(slot) {
    if (slot === null) {
      return Observable.throw("Some Error Accord");
    } else {
      return Observable.create(observer => {

        this.http.get(this.ordersURL + '&session_id=' + this.currentUser.data.session_id + '&order_status=7&milkrun_id=' + this.currentUser.data.milkrun_id + '&slot=' + slot)
          .map(res => res.json()).subscribe(
          data => {
            if (data.status === 100) {
              this.orders = data;
              localStorage.setItem('orders', JSON.stringify(data));
              observer.next(true);
              observer.complete();
            }
          },
          err => {
            observer.next(false);
            observer.complete();
          });
      });
    }
  }

  public getCompletedOrders(slot) {
    if (slot === null) {
      return Observable.throw("Some Error Accord");
    } else {
      return Observable.create(observer => {

        this.http.get(this.ordersURL + '&session_id=' + this.currentUser.data.session_id + '&order_status=1&milkrun_id=' + this.currentUser.data.milkrun_id + '&slot=' + slot)
          .map(res => res.json()).subscribe(
          data => {
            if (data.status === 100) {
              this.completedOrders = data;
              localStorage.setItem('completedOrders', JSON.stringify(data));
              observer.next(true);
              observer.complete();
            }
          },
          err => {
            observer.next(false);
            observer.complete();
          });
      });
    }
  }

public returnPartialOrder(returnItems) {
   
    var headers = new Headers();
    headers.append("Content-Type", 'application/json');
    headers.append("api-key", this.apiKey)
    headers.append("Accept", 'application/json');

    let requestoptions = new RequestOptions({
      method: RequestMethod.Post,
      url: this.returnOrderURL,
      headers: headers,
      body: returnItems
    })

    return Observable.create(observer => {
      this.http.request(new Request(requestoptions))
        .map((res: Response) => res.json()).subscribe(
        data => {
          if (data.status === 100) {
            observer.next(true);
            observer.complete();

          }
        },
        err => {
          observer.next(false);
          observer.complete();
        });


    });
  }

  public recivedCash(order) {
    let sentData = { "cash_type": "", "time_stamp": "", "order_no": "", "cash_amount": "" };
    sentData.cash_type = "cash";
    this.dateTime = new Date();
    sentData.time_stamp = this.dateTime;
    sentData.order_no = order.order_no;
    sentData.cash_amount = order.total_price;

    var headers = new Headers();
    headers.append("Content-Type", 'application/json');
    headers.append("api-key", this.apiKey)
    headers.append("Accept", 'application/json');

    let requestoptions = new RequestOptions({
      method: RequestMethod.Post,
      url: this.cash,
      headers: headers,
      body: sentData
    })





    return Observable.create(observer => {
      this.http.request(new Request(requestoptions))
        .map((res: Response) => res.json()).subscribe(
        data => {
          if (data.status === 100) {
            observer.next(true);
            observer.complete();

          }
        },
        err => {
          observer.next(false);
          observer.complete();
        });


    });
  }

  public recivedCard(order, card) {
    let sentData = { "cash_type": "", "time_stamp": "", "order_no": "", "cash_amount": "", "pin": "", "txn_no": "" };
    sentData.cash_type = "card";
    this.dateTime = new Date();
    sentData.time_stamp = this.dateTime;
    sentData.order_no = order.order_no;
    sentData.cash_amount = order.total_price;
    sentData.pin = card.card;
    sentData.txn_no = card.txn_no;

    var headers = new Headers();
    headers.append("Content-Type", 'application/json');
    headers.append("api-key", this.apiKey)
    headers.append("Accept", 'application/json');

    let requestoptions = new RequestOptions({
      method: RequestMethod.Post,
      url: this.cash,
      headers: headers,
      body: sentData
    })





    return Observable.create(observer => {
      this.http.request(new Request(requestoptions))
        .map((res: Response) => res.json()).subscribe(
        data => {
          if (data.status === 100) {
            observer.next(true);
            observer.complete();

          }
        },
        err => {
          observer.next(false);
          observer.complete();
        });


    });
  }

  public recivedBoth(order, card) {
    let sentData = { "cash_type": "", "time_stamp": "", "order_no": "", "cash_amount": "", "card_amount": "", "pin": "", "txn_no": "" };
    sentData.cash_type = "mixed";
    this.dateTime = new Date();
    sentData.time_stamp = this.dateTime;
    sentData.order_no = order.order_no;
    sentData.cash_amount = card.cashAmt;
    sentData.card_amount = card.cashAmt;
    sentData.pin = card.card;
    sentData.txn_no = card.txn_no;

    var headers = new Headers();
    headers.append("Content-Type", 'application/json');
    headers.append("api-key", this.apiKey)
    headers.append("Accept", 'application/json');

    let requestoptions = new RequestOptions({
      method: RequestMethod.Post,
      url: this.cash,
      headers: headers,
      body: sentData
    })





    return Observable.create(observer => {
      this.http.request(new Request(requestoptions))
        .map((res: Response) => res.json()).subscribe(
        data => {
          if (data.status === 100) {
            observer.next(true);
            observer.complete();
          }
        },
        err => {
          observer.next(false);
          observer.complete();
        });


    });
  }

  public completeOrder(order) {
    let sentData = { "order_status": "complete", "time_stamp": "", "order_no": "" };
    this.dateTime = new Date();
    sentData.order_no = order.order_no;
    sentData.time_stamp = this.dateTime;
    var headers = new Headers();
    headers.append("Content-Type", 'application/json');
    headers.append("api-key", this.apiKey)
    headers.append("Accept", 'application/json');

    let requestoptions = new RequestOptions({
      method: RequestMethod.Post,
      url: this.completeOrderURL,
      headers: headers,
      body: sentData
    })

    return Observable.create(observer => {
      this.http.request(new Request(requestoptions))
        .map((res: Response) => res.json()).subscribe(
        data => {
          if (data.status === 100) {
            observer.next(true);
            observer.complete();

          }
        },
        err => {
          observer.next(false);
          observer.complete();
        });


    });

  }
  public cancelOrder(order) {
    let sentData = { "order_status": "cancelled", "time_stamp": "", "order_no": "" };
    this.dateTime = new Date();
    sentData.order_no = order.order_no;
    sentData.time_stamp = this.dateTime;
    var headers = new Headers();
    headers.append("Content-Type", 'application/json');
    headers.append("api-key", this.apiKey)
    headers.append("Accept", 'application/json');

    let requestoptions = new RequestOptions({
      method: RequestMethod.Post,
      url: this.completeOrderURL,
      headers: headers,
      body: sentData
    })

    return Observable.create(observer => {
      this.http.request(new Request(requestoptions))
        .map((res: Response) => res.json()).subscribe(
        data => {
          if (data.status === 100) {
            observer.next(true);
            observer.complete();

          }
        },
        err => {
          observer.next(false);
          observer.complete();
        });


    });

  }

  public getUserInfo(): User {
    return this.currentUser;
  }

  public getAllOrders(): allOrders {
    return this.orders;
  }
  public getAllCompletedOrders(): allOrders {
    return this.completedOrders;
  }


  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      localStorage.removeItem('currentUser');
      observer.next(true);
      observer.complete();
    });
  }
}