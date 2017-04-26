import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ActionSheetController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';


/*
  Generated class for the Order page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order',
  templateUrl: 'order.html'
})
export class OrderPage {
  order: any;
  loading: Loading;
  card: any;
  dateTime: any;
  testCheckboxOpen: boolean;
  testCheckboxResult;
  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, public platform: Platform,
    public actionsheetCtrl: ActionSheetController, public alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.order = navParams.get('order');
    console.log(localStorage.getItem("selectedslot"));

  }

  cancelOrder() {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'Do you want to cancel this order.',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {

            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.showLoading();
            this.auth.cancelOrder(this.order).subscribe(allowed => {
              if (allowed) {
                setTimeout(() => {
                  this.loading.dismiss();
                  this.navCtrl.setRoot(HomePage);
                  this.loading.dismiss();
                });
              } else {
                this.showError("Some Problem");
              }
            },
              error => {
                this.showError(error);
              });
          }
        }
      ]
    });
    confirm.present();
  }
  returnPartialOrder() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select returned items');
    for (let item of this.order.item_details) {
      alert.addInput({
        type: 'checkbox',
        label: item.item_name,
        value: item.item_id,
        checked: item.checked
      });
    }
    

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Return',
      handler: data => {
        let accepted_items: any = Object.assign([], this.order.item_details);
       let rejected_items: any = [];
       let order = this.order.item_details;

       for(var i=0; i<data.length; i++) {
        order.forEach(function (s) {
          if(s.item_id == data[i]){
            rejected_items.push(s);
            
          } 
        });
        console.log();
        accepted_items.splice(accepted_items.findIndex(function(obj){return obj.item_id == data[i]}), 1);
       };
   

        console.log(rejected_items);
        console.log(accepted_items);

        let returnOrder:any = {"order_no":"","reason":"","time_stamp":"","accepted_items":[],"rejected_items":[]};

         this.dateTime = new Date();
    returnOrder.order_no = this.order.order_no;
    returnOrder.time_stamp = this.dateTime;
    returnOrder.reason = "Partial Return";
    returnOrder.accepted_items = accepted_items;
    returnOrder.rejected_items = rejected_items;

    this.showLoading();
            this.auth.returnPartialOrder(returnOrder).subscribe(allowed => {
              if (allowed) {
                setTimeout(() => {
                  this.loading.dismiss();
                  this.navCtrl.setRoot(HomePage);
                  this.loading.dismiss();
                });
              } else {
                this.showError("Some Problem");
              }
            },
              error => {
                this.showError(error);
              });




        this.testCheckboxOpen = false;
        this.testCheckboxResult = data;
      }
    });
    alert.present();
  }

  openMenu() {
    if(this.order.payment_method == "Online Payment"){
      this.showLoading();
      this.auth.completeOrder(this.order).subscribe(allowed => {
                    if (allowed) {
                      setTimeout(() => {
                        this.loading.dismiss();
                        this.navCtrl.setRoot(HomePage);
                      });
                    } else {
                      this.showError("Some Problem");
                       this.loading.dismiss();
                    }
                  },
                    error => {
                      this.showError(error);
                       this.loading.dismiss();
                    });
                 
                
    } else {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Select Payment Type',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Cash',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'cash' : null,
          handler: () => {
            this.showLoading();
            this.auth.recivedCash(this.order).subscribe(allowed => {
              if (allowed) {
                setTimeout(() => {
                  this.auth.completeOrder(this.order).subscribe(allowed => {
                    if (allowed) {
                      setTimeout(() => {
                        this.loading.dismiss();
                        this.navCtrl.setRoot(HomePage);
                      });
                    } else {
                      this.showError("Some Problem");
                    }
                  },
                    error => {
                      this.showError(error);
                    });
                  this.loading.dismiss();
                });
              } else {
                this.showError("Some Problem");
              }
            },
              error => {
                this.showError(error);
              });
          }
        },
        {
          text: 'Card',
          icon: !this.platform.is('ios') ? 'card' : null,
          handler: () => {
            let prompt = this.alertCtrl.create({
              title: 'Enter Card Details',
              inputs: [
                {
                  name: 'card',
                  placeholder: 'Last 4 digits'
                },
                {
                  name: 'txn_no',
                  placeholder: 'Transaction No'
                }
              ],
              buttons: [
                {
                  text: 'Cancel',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Complete Delivery',
                  handler: data => {
                    this.showLoading();

                    this.auth.recivedCard(this.order, data).subscribe(allowed => {
                      if (allowed) {
                        setTimeout(() => {
                          this.auth.completeOrder(this.order).subscribe(allowed => {
                            if (allowed) {
                              setTimeout(() => {
                                this.loading.dismiss();
                                this.navCtrl.setRoot(HomePage);
                              });
                            } else {
                              this.showError("Some Problem");
                            }
                          },
                            error => {
                              this.showError(error);
                            });


                          this.loading.dismiss();
                        });
                      } else {
                        this.showError("Some Problem");
                      }
                    },
                      error => {
                        this.showError(error);
                      });
                  }
                }
              ]
            });
            prompt.present();
          }
        },
        {
          text: 'Both',
          icon: !this.platform.is('ios') ? 'closed-captioning' : null,
          handler: () => {
            let prompt = this.alertCtrl.create({
              title: 'Enter Card Details',
              inputs: [
                {
                  name: 'cashAmt',
                  placeholder: 'Cash Amount'
                },
                {
                  name: 'cardAmt',
                  placeholder: 'Card Amount'
                }, {
                  name: 'card',
                  placeholder: 'Last 4 digits'
                },
                {
                  name: 'txn_no',
                  placeholder: 'Transaction No'
                }
              ],
              buttons: [
                {
                  text: 'Cancel',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: 'Complete Delivery',
                  handler: data => {
                    this.showLoading();

                    this.auth.recivedBoth(this.order, data).subscribe(allowed => {
                      if (allowed) {
                        setTimeout(() => {
                          this.auth.completeOrder(this.order).subscribe(allowed => {
                            if (allowed) {
                              setTimeout(() => {
                                this.loading.dismiss();
                                this.navCtrl.setRoot(HomePage);
                              });
                            } else {
                              this.showError("Some Problem");
                            }
                          },
                            error => {
                              this.showError(error);
                            });


                          this.loading.dismiss();
                        });
                      } else {
                        this.showError("Some Problem");
                      }
                    },
                      error => {
                        this.showError(error);
                      });
                  }
                }
              ]
            });
            prompt.present();
          }
        }
      ]
    });
    actionSheet.present();
  }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  public goBack() {
    this.navCtrl.setRoot(HomePage)
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

  public logout() {
    this.auth.logout().subscribe(succ => {
      this.navCtrl.setRoot(LoginPage)
    });
  }

}
