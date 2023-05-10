import { Component,ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Observable, take } from 'rxjs';
import { TokenStorageService } from '../_services/token-storage.service';
import { ChatService } from '../_services/chat.service';
import { WebsocketsService } from '../_services/websockets.service';

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
  currentUserId = this.tokenService.getUser().id
  model = {
    icon: 'chatbubbles-outline',
    title: 'No Chat Rooms',
    color: 'danger'
  };

  constructor(
    private router: Router,
    private tokenService: TokenStorageService,
    public chatService: ChatService,
    public webSocketService: WebsocketsService
  ) { }

  ngOnInit() {
    this.getChatRoomsByUser();
  }

  getChatRoomsByUser() {
    this.chatService.getChatRoomsByUser().subscribe({
      next: data => {
        console.log("dateFromGR::", data)
        this.chatService.chatRooms.next(data);
        console.log('chatrooms: ', this.chatService.chatRooms?.getValue());
      },
      error: err => {
        console.error("GRE::", err.message);
      }
    });
  }

  handleRefresh(event) {
    this.webSocketService.reloadRooms();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  };

  newChat() {
    this.open_new_chat = true;
    if(!this.users) this.getUsers();
  }

  getUsers() {
    this.users = this.chatService.getUsers();
  }

  onWillDismiss(event: any) {}

  cancel() {
    this.modal.dismiss();
    this.open_new_chat = false;
  }
 

  startChat(item) {
    try {
      console.log("item:: ", item);
      this.chatService.createChatRoom(item?.id).subscribe({
        next: room => {
          console.log('room: ', room);
          this.cancel();
          const navData: NavigationExtras = {
            queryParams: {
              name: item?.displayName
            }
          };
          this.router.navigate(['/tabs', 'tab2', 'chats', room[0]?.roomId], navData);},
          error: err => {
          console.error("StartChat", err);
        }
      });
    } catch(e) {
      console.log(e);
      // this.global.hideLoader();
    }
  }

  onSegmentChanged(event: any) {
    console.log(event);
    this.segment = event.detail.value;
  }

  getChat(item) {
    console.log(item?.roomId);
    const navData: NavigationExtras = {
        queryParams: {
          name: item?.displayName
        }
    };
    this.router.navigate(['/tabs', 'tab2', 'chats', item?.roomId], navData);
  }

  getUser(user: any) {
    return user;
  }

}

