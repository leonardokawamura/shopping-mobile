import { MoreOptionsComponent } from './../../components/more-options/more-options';
import { AudioRecorderProvider } from '../../providers/audio-recorder/audio-recorder';
import { StoragePermissionProvider } from '../../providers/storage-permission/storage-permission';
import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Popover,
  PopoverController
} from 'ionic-angular';
import {
  ChatGroupListComponent
} from '../../components/chat-group-list/chat-group-list';
import { RedirectIfNotAuthProvider } from '../../providers/redirect-if-not-auth/redirect-if-not-auth';


@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  chatGroupList = ChatGroupListComponent;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private audioRecorder: AudioRecorderProvider,
    private redirectIfNotAuth: RedirectIfNotAuthProvider,
    private popover: PopoverController
  ) {}

  ionViewCanEnter(){
    return this.redirectIfNotAuth.ionViewCanEnter();
  }

  ionViewDidLoad() {
    const hasPermissionToRecorder = this.audioRecorder.hasPermission;
    this.audioRecorder.requestPermission()
        .then((result) => {
            if (result && !hasPermissionToRecorder) {
                this.audioRecorder.showAlertToCloseApp();
            }
        });

  }

  presentMoreOptions(event){
    const popover = this.popover.create(MoreOptionsComponent);
    popover.present({
      ev: event
    });
  }

}
