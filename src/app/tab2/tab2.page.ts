import { Component,ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Observable, take } from 'rxjs';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  @ViewChild('new_chat') modal: ModalController;
  @ViewChild('popover') popover: PopoverController;
  segment = 'chats';
  open_new_chat = false;
  users: Observable<any[]>;
  chatRooms: Observable<any[]>;
  model = {
    icon: 'chatbubbles-outline',
    title: 'No Chat Rooms',
    color: 'danger'
  };
  // users = [
  //   {id: 1, name: 'NIkhil', photo: 'https://i.pravatar.cc/315'},
  //   {id: 2, name: 'XYZ', photo: 'https://i.pravatar.cc/325'},
  // ];
  // chatRooms = [
  //   {id: 1, name: 'NIkhil', photo: 'https://i.pravatar.cc/315'},
  //   {id: 2, name: 'XYZ', photo: 'https://i.pravatar.cc/325'},
  // ];

  constructor(
    private router: Router,
    private tokenService: TokenStorageService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getRooms();
  }

  getRooms() {
    // this.chatService.getId();
  }

  onSegmentChanged(event: any) {
    console.log(event);
    this.segment = event.detail.value;
  }

  newChat() {
    this.open_new_chat = true;
    if(!this.users) this.getUsers();
  }

  getUsers() {
    this.users = this.userService.getAllUsers(this.tokenService.getUser().id);
  }

  onWillDismiss(event: any) {}

  cancel() {
    this.modal.dismiss();
    this.open_new_chat = false;
  }

  async startChat(item) {
    try {
      // this.global.showLoader();
      // create chatroom
      this.cancel();
      const navData: NavigationExtras = {
        queryParams: {
          name: item?.displayName
        }
      };
      this.router.navigate(['/tabs', 'tab2', 'chats', '1'], navData);
      // this.global.hideLoader();
    } catch(e) {
      console.log(e);
      // this.global.hideLoader();
    }

  }

  getChat(item) {
  }

  getUser(user: any) {
    return user;
  }

}

