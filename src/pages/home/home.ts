import {Component} from '@angular/core';
import {NavController, NavParams, Platform, AlertController, LoadingController, Loading, ItemSliding } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { SlotsPage } from '../slots/slots';
import { OrderPage } from '../order/order';

declare var window;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  

})
export class HomePage {

  slot: any;
  allOrders: any = {"status":100,"data":[]};
  allCompletedOrders: any = {"status":100,"data":[]};
  order: string = "pending";
  isAndroid: boolean = false;
  loading: Loading;
  goOrder: any;

  constructor(private nav: NavController, public navParams: NavParams, private auth: AuthService, platform: Platform, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.slot = navParams.get('slot');
    this.isAndroid = platform.is('android');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SlotsPage');
    this.loadOrders();
   

  }
 public loadOrders(){
    this.showLoading();
    console.log(this.slot);
    this.auth.getOrders(this.slot).subscribe(allowed => {
      if (allowed) {
        setTimeout(() => {
          this.allOrders = this.auth.getAllOrders();
          console.log(this.allOrders); 
          this.loadAllOrders();
          this.loading.dismiss();
        });
      } else {
        this.showError("No Orders Found");
         this.loading.dismiss();
      }
    },
    error => {
      this.showError(error);
       this.loading.dismiss();
    });
 }

 public loadAllOrders(){
    //this.showLoading();
    this.auth.getCompletedOrders(this.slot).subscribe(allowed => {
      if (allowed) {
        setTimeout(() => {
          this.allCompletedOrders = this.auth.getAllCompletedOrders();
          console.log(this.allCompletedOrders); 
        //this.loading.dismiss();
        });
      } else {
        //this.showError("No Orders Found");
         //this.loading.dismiss();
      }
    },
    error => {
      this.showError(error);
       this.loading.dismiss();
    }); 
  }
  
  public logout() {
    this.auth.logout().subscribe(succ => {
        this.nav.setRoot(LoginPage)
    });
  }
  public changeSlot() {
        this.nav.setRoot(SlotsPage)
  }
  itemSelected(event, order) {
    console.log("Selected Slot", order);
    this.nav.setRoot(OrderPage, {order: order});
  }
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }
 
  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });
 
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
  share(slidingItem: ItemSliding) {
    slidingItem.close();
  }
 public callIT(passedNumber){
    //You can add some logic here
    console.log(passedNumber);
     window.location = "tel:+91"+passedNumber;
  }
}