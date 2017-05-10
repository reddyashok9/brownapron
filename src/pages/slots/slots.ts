import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';

/*
  Generated class for the Slots page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-slots',
  templateUrl: 'slots.html'
})
export class SlotsPage {

  user:any;
  slots:any;
  slot: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private auth: AuthService) {
    let info = this.auth.getUserInfo();
    this.user = info;
    this.slots = this.user.data.slots;
     localStorage.removeItem('selectedslot');
    console.log(this.user);
    platform.ready().then(()=>{
       platform.registerBackButtonAction(()=>this.logout());
    });
  }

   public logout() {
    this.auth.logout().subscribe(succ => {
        this.navCtrl.setRoot(LoginPage)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SlotsPage ');

  }

  itemSelected(event, slot) {
    console.log("Selected Slot", slot);
    this.navCtrl.setRoot(HomePage, {slot: slot})
  }

}
