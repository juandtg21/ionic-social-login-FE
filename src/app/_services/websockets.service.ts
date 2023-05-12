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
  private topicReload = '/user/queue/reload';
  private topicReloadMessages = '/user/queue/reload/messages';
  public stompClient: any;

  constructor(private tokenService: TokenStorageService, 
    private chatService: ChatService,
    private ref: ApplicationRef) {
    console.log('Initialize WebSocket Connection');
    this.connect();
  }

  connect(): void {
    const that = this;
    console.log('Initialize WebSocket Connection');
    const headers = this.getHeaders(this.tokenService.getToken());
    const socket = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({'user': that.chatService.chatRoomId}, function (frame) {
      console.log('Connected: ' + frame);


      that.stompClient.subscribe(`/queue/${that.chatService.chatRoomId}/messages`, function (message) {
        console.log("Received message:", message);
        const parsedMessage = JSON.parse(message.body);
        if (parsedMessage.chatRoomId === that.chatService.chatRoomId) {
           console.log("Received message:", parsedMessage);
           that.chatService.chats.push(parsedMessage);
           that.chatService.notifyValueChange.next(parsedMessage.senderId);
          }
          that.chatService.alarmNotify();
          that.ref.tick();
      });
     
  
      that.stompClient.subscribe(that.topicReload, function (responseMessage) {
        const userDto: any = JSON.parse(responseMessage.body);
        console.log("userDto", userDto.body);
      
        if (userDto.body) {
          that.chatService.chatRooms.next([]); // Clear the chatRooms list
          that.chatService.chatRooms.next(userDto.body);
        }
      });

      that.stompClient.subscribe(that.topicReloadMessages, function (responseMessage) {
        const parsedMessage = JSON.parse(responseMessage.body);
        console.log("responseMessage", responseMessage.body);
        console.log("chatRoomId",  that.chatService.chatRoomId);
        parsedMessage.forEach(parsedMessage => {
          if (parsedMessage.chatRoomId === that.chatService.chatRoomId) {
            console.log("responseMessage", parsedMessage);
            that.chatService.chats.push(parsedMessage);
          }});
      });
    }, that.errorCallBack);
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

  sendMessage(chatRoomId, receiver, message): void {
    let sender =  this.tokenService.getUser();
    const headers = this.getHeaders(this.tokenService.getToken());
    const messages: any = {
      chatRoomId: chatRoomId,
      senderId: sender.id,
      receiverName: receiver,
      message: message,
  };
    this.stompClient.send(`/api/messages/${chatRoomId}`, {}, JSON.stringify(messages), headers);
  }

  reloadRooms(): void {
    let userId =  this.tokenService.getUser();
    const headers = this.getHeaders(this.tokenService.getToken());
    this.stompClient.send(`/api/reload`, {}, JSON.stringify(userId.id), headers);
  }

  reloadMessages(): void {
    let chatRoomId =  this.chatService.chatRoomId;
    console.log("chatRoomId", chatRoomId);
    const headers = this.getHeaders(this.tokenService.getToken());
    this.stompClient.send(`/api/reload/messages`, {}, JSON.stringify(chatRoomId), headers);
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
