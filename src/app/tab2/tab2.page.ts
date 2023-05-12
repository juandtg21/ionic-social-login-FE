import { Component,OnDestroy,OnInit,ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Observable, Subscription, take } from 'rxjs';
import { TokenStorageService } from '../_services/token-storage.service';
import { ChatService } from '../_services/chat.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {

  @ViewChild('new_chat') modal: ModalController;
  @ViewChild('popover') popover: PopoverController;

  public isNotify = false;
  private subscription: Subscription;
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
    public chatService: ChatService
  ) { }

  ngOnInit() {
    this.subscription = this.chatService.notifyValueChange.subscribe((userId) => {
      console.log("userId", userId)
      console.log("this.chatService.currentUserId", this.chatService.currentUserId)
      this.isNotify = userId == this.chatService.currentUserId
      console.log("isNotify", this.isNotify)
    })
    this.getChatRoomsByUser();
  }

  getChatRoomsByUser() {
    this.chatService.getChatRoomsByUser().subscribe({
      next: data => {
        console.log("userDto", data);
  
        if (data) {
          this.chatService.chatRooms.next([]); // Clear the chatRooms list
          this.chatService.chatRooms.next(data);
        }
      },
      error: err => {
        console.error("GRE::", err.message);
      }
    });
  }

  handleRefresh(event) {
    this.getChatRoomsByUser();
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
      this.chatService.currentChatUser = item;
      console.log("startChat-currentChatUser", this.chatService.currentChatUser);
      this.chatService.createChatRoom(item?.id).subscribe({
        next: rooms => {
          console.log('rooms: ', rooms);
          this.cancel();
  
          const roomIndex = rooms.findIndex(room => room.id == item?.id);
          console.log("roomIndex", roomIndex);
          if (roomIndex !== -1) {
            const navData: NavigationExtras = {
              queryParams: {
                name: item?.displayName
              }
            };
            this.chatService.chatRoomId = rooms[roomIndex].roomId;
            this.chatService.picture = item?.picture != null ? item.picture : "//ssl.gstatic.com/accounts/ui/avatar_2x.png";
            this.isNotify = false;
            this.router.navigate(['/tabs', 'tab2', 'chats', rooms[roomIndex].roomId], navData);
          } else {
            console.error('Matching room not found for item:', item?.id);
          }
        },
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
    this.chatService.currentChatUser = item;
    this.chatService.chatRoomId = item.roomId;
    this.chatService.picture = item?.picture != null ? item.picture : "//ssl.gstatic.com/accounts/ui/avatar_2x.png";
    this.isNotify = false;
    console.log("getChat-currentChatUser", this.chatService.currentChatUser);
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

