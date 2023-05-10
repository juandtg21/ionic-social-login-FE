import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../common/app.constants';

const httpOptions = {
		  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getPublicContent(): Observable<any> {
    return this.http.get(AppConstants.API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(AppConstants.API_URL + 'user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(AppConstants.API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(AppConstants.API_URL + 'admin', { responseType: 'text' });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(AppConstants.API_URL + 'user/me', httpOptions);
  }

  getAllUsers(id): Observable<any> {
    return this.http.get(AppConstants.ACTIVE + id, httpOptions);
  }

  getChatRoomsByUser(id): Observable<any> {
    const url = AppConstants.CHAT_ROOM_BY_USER + id;
    console.log("URL:: ", url)
    return this.http.get(url, httpOptions);
  }

  createChatRoom(chatRoom): Observable<any> {
    console.log("createChatRoom", chatRoom);
    return this.http.post(AppConstants.CREATE_CHAT_ROOM, chatRoom);
  }

  findChatRoomByRoomId(chatRoom): Observable<any> {
    const url = AppConstants.CHAT_ROOM_BY_USERS;
    const params = new HttpParams()
    .set('currentUserId', chatRoom.currentUserId)
    .set('members', chatRoom.members);
    const httpOptions = {
    params: params,
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })};
    return this.http.get(url, httpOptions);
  }

  logout(currentUserId) {
    console.log("LG::", AppConstants.LOGOUT + currentUserId);
    return this.http.get(AppConstants.LOGOUT + currentUserId)
  }

}
