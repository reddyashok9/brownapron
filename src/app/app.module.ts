import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SlotsPage } from '../pages/slots/slots';
import { OrderPage } from '../pages/order/order';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../providers/auth-service';
import { ArrayFilterPipe } from "./pipes/filter.pipe";

@NgModule({
  declarations: [
    ArrayFilterPipe,
    MyApp,
    HomePage,
    LoginPage,
    SlotsPage,
    OrderPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  exports: [
    ArrayFilterPipe
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SlotsPage,
    OrderPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService
  ]
})
export class AppModule {}
