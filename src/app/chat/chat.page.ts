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
  isTyping = false;
  typingStatusMessage = '';
  typingTimer: any;
  typingTimeoutDuration = 1000;
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
    this.chatService.chats = [];
    const data: any = this.route.snapshot.queryParams;
    if (data?.name) {
    this.name = data.name;
  }
  
  const id = this.route.snapshot.paramMap.get('id');
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
    this.chatService.chats = [];
    this.webSocketService.reloadRooms();
    this.disconnect();
  }

  sendMessage() {
    if(!this.message || this.message?.trim() == '') {

      return;
    }
    try {
      this.isLoading = true;
      this.webSocketService.sendMessage(this.id, this.chatService.currentChatUser.email, this.message);
      this.message = '';
      this.isLoading = false;
      this.scrollToBottom();
    } catch(e) {
      this.isLoading = false;
      console.log(e);
    }
  }

  startTyping() {
    clearTimeout(this.typingTimer); // Clear any previous typing timeout
    this.webSocketService.sendTypingStatus("is typing...", this.chatService.currentChatUser.email);
    // Set a timeout to stop typing if there is no activity after a certain duration
    this.typingTimer = setTimeout(() => {
      this.stopTyping();
    }, this.typingTimeoutDuration);
  }
  
  stopTyping() {
    this.webSocketService.sendTypingStatus("", this.chatService.currentChatUser.email);
  }

  onInputChange() {
    clearTimeout(this.typingTimer); // Clear any previous typing timeout

    if (!this.isTyping) {
        this.startTyping();
    } else {
      this.stopTyping();
    }
  }

  private disconnect(): void {
    setTimeout(() => {
      this.webSocketService.disconnect();
    }, 500);
  }

}
