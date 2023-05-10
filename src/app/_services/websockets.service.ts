import { ApplicationRef, Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
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
  private topicMessages = '/topic/messages';
  private topicReload = '/topic/reload';
  private stompClient: any;

  constructor(private tokenService: TokenStorageService, 
    private chatService: ChatService) {
    console.log('Initialize WebSocket Connection');
    this.connect();
  }

  connect(): void {
    console.log('Initialize WebSocket Connection');
    const headers = this.getHeaders(this.tokenService.getToken());
    const socket = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect(headers, () => {
      this.stompClient.subscribe(this.topicMessages, (message) => {
        if (message.body) {
          const parsedMessage = JSON.parse(message.body);
          const currentMessages = this.chatService.chats.getValue();
          const updatedMessages = [...currentMessages, parsedMessage];
          this.chatService.chats.next(updatedMessages);
          console.log("MSG::", updatedMessages);
        }
      });
  
      this.stompClient.subscribe(this.topicReload, (responseMessage) => {
        const userDto: any = JSON.parse(responseMessage.body);
        console.log("userDto", userDto.body);
        const currentChatRooms = this.chatService.chatRooms.getValue();
        console.log("currentChatRooms", currentChatRooms);
      
        // Check if the userDto is already present in the currentChatRooms
        const existingRoomIndex = currentChatRooms.findIndex(room => room.roomId === userDto.body.roomId);
        console.log("existingRoomIndex", existingRoomIndex);
        if (existingRoomIndex === -1) {
          this.chatService.chatRooms.next(userDto.body);
        }
        
      });
    }, this.errorCallBack);
  }

  disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected');
  }

  errorCallBack(error): void {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  sendMessage(chatRoomId, message): void {
    let sender =  this.tokenService.getUser();
    const headers = this.getHeaders(this.tokenService.getToken());
    const messages: any = {
      chatRoomId: chatRoomId,
      senderId: sender.id,
      message: message,
  };
    this.stompClient.send(`/api/messages`, {}, JSON.stringify(messages), headers);
  }

  reloadRooms(): void {
    let userId =  this.tokenService.getUser();
    const headers = this.getHeaders(this.tokenService.getToken());
    this.stompClient.send(`/api/reload`, {}, JSON.stringify(userId.id), headers);
  }

  private getHeaders(token: string) {
    const headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        })
    };
    return headers;
  }
}
