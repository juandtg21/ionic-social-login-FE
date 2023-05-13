import { Component,OnDestroy,OnInit,ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Observable, Subscription, take } from 'rxjs';
import { TokenStorageService } from '../_services/token-storage.service';
import { ChatService } from '../_services/chat.service';
import { WebsocketsService } from '../_services/websockets.service';

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
    public chatService: ChatService,
    public webSocketService: WebsocketsService
  ) { }

  ngOnInit() {
    this.subscription = this.chatService.notifyValueChange.subscribe((userId) => {
      this.isNotify = userId == this.chatService.currentUserId
    })
    this.getChatRoomsByUser();
  }

  getChatRoomsByUser() {
    this.chatService.getChatRoomsByUser().subscribe({
      next: data => {
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
      this.chatService.createChatRoom(item?.id).subscribe({
        next: rooms => {
          this.cancel();
  
          const roomIndex = rooms.findIndex(room => room.id == item?.id);
          if (roomIndex !== -1) {
            const navData: NavigationExtras = {
              queryParams: {
                name: item?.displayName
              }
            };
            this.chatService.chatRoomId = rooms[roomIndex].roomId;
            this.chatService.picture = item?.picture != null ? item.picture : "//ssl.gstatic.com/accounts/ui/avatar_2x.png";
            this.isNotify = false;
            this.webSocketService.connect();
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
    }
  }

  onSegmentChanged(event: any) {
    this.segment = event.detail.value;
  }

  getChat(item) {
    this.chatService.currentChatUser = item;
    this.chatService.chatRoomId = item.roomId;
    this.chatService.picture = item?.picture != null ? item.picture : "//ssl.gstatic.com/accounts/ui/avatar_2x.png";
    this.isNotify = false;
    const navData: NavigationExtras = {
        queryParams: {
          name: item?.displayName
        }
    };
    this.webSocketService.connect();
    this.router.navigate(['/tabs', 'tab2', 'chats', item?.roomId], navData);
  }

  getUser(user: any) {
    return user;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

