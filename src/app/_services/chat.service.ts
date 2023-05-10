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
  public users: Observable<any>;
  public chatRooms = new BehaviorSubject<any[]>([]);
  public selectedChatRoomMessages: Observable<any>;
  public notifyValueChange = new Subject();
  public chats = new BehaviorSubject<any[]>([]);

  constructor(private userService: UserService, 
    private tokenService: TokenStorageService,
    private http: HttpClient) { }

  getId() {
    this.currentUserId = this.tokenService.getUser().id;
    console.log(this.currentUserId);
  }

  getUsers(): Observable<any> {
    const httpOptions = this.getHeaders();
    console.log("getUsers", this.currentUserId)
    this.users = this.http.get(AppConstants.ACTIVE + this.currentUserId, httpOptions);
    return this.users;
  }

  createChatRoom(user_id: any) {
    console.log("user_id::", user_id)
    const chatroom = {
      currentUserId: this.currentUserId,
      members: [
        this.currentUserId,
        user_id
      ]
    };
    return this.userService.findChatRoomByRoomId(chatroom).pipe(
      switchMap(data => {
        if (data && data.length > 0) {
          console.log("CCR::", data)
          return of(data[0]); // return existing room
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
    console.log("URL:: ", url)
    return this.http.get(url, httpOptions);
  }

  getChatRoomMessages(chatRoomId: string): Observable<any[]> {
    const httpOptions = this.getHeaders();
    const url = `${AppConstants.CHATS}${chatRoomId}`;
    console.log("URL:: ", url)
  
    return this.http.get<any[]>(url, httpOptions).pipe(
      map(response => {
        console.log("response:: ", response)
        return response;
      })
    );
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
