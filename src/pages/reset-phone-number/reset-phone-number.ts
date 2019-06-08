import { CustomerHttpProvider } from './../../providers/http/customer-http';
import {
  FirebaseAuthProvider
} from './../../providers/auth/firebase-auth';
import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController
} from 'ionic-angular';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { LoginOptionsPage } from '../login-options/login-options';

/**
 * Generated class for the ResetPhoneNumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-phone-number',
  templateUrl: 'reset-phone-number.html',
})
export class ResetPhoneNumberPage {

  email = new FormControl('', [Validators.required, Validators.email])
  canShowFirebaseUI = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private firebaseAuth: FirebaseAuthProvider,
    private customerHttp: CustomerHttpProvider,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
    ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPhoneNumberPage');
  }

  showFirebaseUI() {
    this.canShowFirebaseUI = true;
    this.handleUpdate();
  }

  handleUpdate() {
    this.firebaseAuth.makePhoneNumberForm('#firebase-ui').then(() => {
      const email = this.email.value;
      this.customerHttp.requestUpdatePhoneNumber(email).subscribe(
        () => {
        const alert = this.alertCtrl.create({
          title: 'Alerta',
          subTitle: 'Um email com a validacao da mudança foi enviado. Valide-o para logar com o novo telefone',
          buttons: [{
            text: 'Ok',
            handler: ()=> {
              this.navCtrl.setRoot(LoginOptionsPage)
            }
          }]
        });
        alert.present();
      },
      (responseError) => {
        const toast = this.toastCtrl.create({
          message:'Não foi possivel solicitar a auteração do telefone',
          duration: 3000
        });
        toast.present();
        this.handleUpdate();
      });
    });
  }

}