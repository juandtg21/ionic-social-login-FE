import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ChatService } from '../_services/chat.service';
import { WebsocketsService } from '../_services/websockets.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  id: string;
  name: string;
  picture: string;
  message: string;
  isLoading: boolean;
  model = {
    icon: 'chatbubbles-outline',
    title: 'No Conversation',
    color: 'danger'
  };

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private webSocketService: WebsocketsService,
    public chatService: ChatService
  ) { }

  ngOnInit() {
  const data: any = this.route.snapshot.queryParams;
  console.log('data: ', data);
  console.log('data: ', this.chatService.picture);
  if (data?.name) {
    this.name = data.name;
  }
  
  const id = this.route.snapshot.paramMap.get('id');
  console.log('check id: ', id);
  if (!id) {
    this.navCtrl.back();
    return;
  } 
  this.id = id;

  this.chatService.getChatRoomMessages(this.id).subscribe({
    next: data => {
      if (data) {
        this.chatService.chats = data;
      }
    },
    error: err => {
      console.error("error getting chats", err);
    }
  });
}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if(this.chatService.chats) this.content.scrollToBottom(500);
  }

  reloadRooms(): void {
    this.webSocketService.reloadRooms();
    this.chatService.chats = [];
    //this.webSocketService.reloadMessages()
    this.reconnect();
  }

  sendMessage() {
    if(!this.message || this.message?.trim() == '') {
      // this.global.errorToast('Please enter a proper message', 2000);
      return;
    }
    try {
      console.log("currentChatUser", this.chatService.currentChatUser.memberId)
      this.isLoading = true;
      this.reconnect();
      this.webSocketService.sendMessage(this.id, this.chatService.currentChatUser.memberId, this.message);
      this.message = '';
      this.isLoading = false;
      this.scrollToBottom();
    } catch(e) {
      this.isLoading = false;
      console.log(e);
      // this.global.errorToast();
    }
  }

  private reconnect(): void {
    console.log("Server connected?", this.webSocketService.stompClient.connected)
    if (this.webSocketService.stompClient == null || 
      !this.webSocketService.stompClient.connected) {
        console.log('Reconnecting...');
        setTimeout(() => {
          this.webSocketService.connect();
        }, 5000);
    }
  }

}
