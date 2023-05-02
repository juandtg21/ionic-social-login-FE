import { Component,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  @ViewChild('new_chat') modal: ModalController;
  segment = 'chats';
  open_new_chat = false;
  users: Observable<any[]>;
  chatRooms: Observable<any[]>;
  model = {
    icon: 'chatbubbles-outline',
    title: 'No Chat Rooms',
    color: 'danger'
  };

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  newChat() {
    this.open_new_chat = true;
    if(!this.users) return;
  }

  onWillDismiss(event: any) {}

  cancel() {
    this.modal.dismiss();
    this.open_new_chat = false;
  }

}

