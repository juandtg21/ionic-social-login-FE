import { ApplicationRef, Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import { HttpHeaders } from '@angular/common/http';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AppConstants } from '../common/app.constants';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {
  private webSocketEndPoint = AppConstants.WEBSOCKET_URL;
  public stompClient: any;

  constructor(private tokenService: TokenStorageService, 
    private chatService: ChatService,
    private ref: ApplicationRef) {
  }

  connect(): void {
    const that = this;
    const headers = {
      'Authorization': that.tokenService.getToken()
    };
    const socket = new SockJS(that.webSocketEndPoint);
    this.stompClient = Stomp.over(socket);
    //this.stompClient.debug = false;
    this.stompClient.connect(headers, function (frame) {

      that.subscribeToChatMessages();
      that.subscribeToChatRoomReload();
      that.subscribeToTypingNotifications();
      
    }, that.errorCallBack);
  }

  connectAndSubscribeToQueues(): void {
    this.connect();
  }

  subscribeToChatMessages(): void {
    const that = this;
    const chatRoomId = this.chatService.chatRoomId;
    this.stompClient.subscribe(`/user/${chatRoomId}/queue/messages`, function (message) {
      const parsedMessage = JSON.parse(message.body);
      if (parsedMessage.chatRoomId === chatRoomId) {
        that.chatService.chats.push(parsedMessage);
        that.chatService.alarmNotify();
      } else {
        that.chatService.notifyValueChange.next(parsedMessage.senderId);
      }
      that.ref.tick();
    });
  }
  
  subscribeToChatRoomReload(): void {
    const that = this;
    const userEmail = this.tokenService.getUser().email;
    this.stompClient.subscribe(`/user/${userEmail}/queue/reload`, function (responseMessage) {
      const userDto: any = JSON.parse(responseMessage.body);
      if (userDto.body) {
        that.chatService.chatRooms.next([]); // Clear the chatRooms list
        that.chatService.chatRooms.next(userDto.body);
      }
    });
  }

  subscribeToTypingNotifications(): void {
    const that = this;
    const chatRoomId = this.chatService.chatRoomId;
    this.stompClient.subscribe(`/user/${chatRoomId}/queue/typing`, function (typing) {
      const parsedMessage = JSON.parse(typing.body);
      if (parsedMessage.email === that.chatService.currentChatUser.email) {
        that.chatService.isTyping = parsedMessage.isTyping;
      }
    });
  }

  disconnect(): void {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }

  errorCallBack(error): void {
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  sendMessage(chatRoomId, receiver, message): void {
    let sender =  this.tokenService.getUser();
    const headers = this.getHeaders(this.tokenService.getToken());
    const messages: any = {
      chatRoomId: chatRoomId,
      senderId: sender.id,
      receiverName: receiver,
      message: message,
  };
    this.stompClient.send(`/api/messages/${chatRoomId}`, headers, JSON.stringify(messages));
  }

  sendTypingNotifications(isTyping, receiver) {
    let sender =  this.tokenService.getUser();
    const message = {
      email: sender.email,
      receiver: receiver,
      isTyping: isTyping,
      chatRoomId: this.chatService.chatRoomId
    }
    this.stompClient.send(`/api/typing`, {}, JSON.stringify(message));
  }

  sendChatRoomReload(): void {
    let user =  this.tokenService.getUser();
    const headers = this.getHeaders(this.tokenService.getToken());
    this.stompClient.send(`/api/reload`, headers, JSON.stringify(user.id));
  }

  private getHeaders(token: string) {
    const headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'user': this.chatService.chatRoomId
        })
    };
    return headers;
  }
}
