import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, of, switchMap } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { UserService } from './user.service';
import { AppConstants } from '../common/app.constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  currentUserId: string;
  currentChatUser: any;
  chatRoomId: string;
  picture: string;
  isTyping: false;
  public users: Observable<any>;
  public chatRooms = new BehaviorSubject<any[]>([]);
  public notifyValueChange = new Subject();
  public chats: any = [];

  constructor(private userService: UserService, 
    private tokenService: TokenStorageService,
    private http: HttpClient) { }

  getId() {
    this.currentUserId = this.tokenService.getUser().id;
  }

  getUsers(): Observable<any> {
    const httpOptions = this.getHeaders();
    this.users = this.http.get(AppConstants.ACTIVE + this.currentUserId, httpOptions);
    return this.users;
  }

  createChatRoom(user_id: any) {
    
    const chatroom = {
      currentUserId: this.currentUserId,
      members: [
        this.currentUserId,
        user_id
      ]
    };
    return this.userService.findChatRoomByChatRoomSequence(chatroom).pipe(
      switchMap(data => {
        if (data && data.length > 0) {
          return of(data);
        } else {
          const data = {
            chatName: name,
            members: [
              this.currentUserId,
              user_id
            ],
            type: 'PRIVATE'
          };
          return this.userService.createChatRoom(chatroom); // create new room
        }
      })
    );
  }

  getChatRoomsByUser(): Observable<any> {
    this.getId();
    const httpOptions = this.getHeaders();
    const url = `${AppConstants.CHAT_ROOM_BY_USER}/${this.currentUserId}`;
    return this.http.get(url, httpOptions);
  }

  getChatRoomMessages(chatRoomId: string): Observable<any[]> {
    const httpOptions = this.getHeaders();
    const url = `${AppConstants.CHATS}${chatRoomId}`;
  
    return this.http.get<any[]>(url, httpOptions).pipe(
      map(response => {
        return response;
      })
    );
  }

  sendMessage(chatRoomId, recipientId, message): Observable<any> {
    let sender =  this.tokenService.getUser();
    const headers = this.getHeaders();
    const messages: any = {
      chatRoomId: chatRoomId,
      senderId: sender.id,
      recipientId: recipientId,
      message: message,
    };
    return this.http.post(AppConstants.SAVE_MESSAGE, messages, headers);
  }

  public alarmNotify() {
    const audio = new Audio();
    audio.src = AppConstants.AUDIO_URL;
    audio.load();
    audio.play();
  }

  private getHeaders() {
    const headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.tokenService.getToken()}`
        })
    };
    return headers;
  }

}
