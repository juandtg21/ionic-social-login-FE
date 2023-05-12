import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '../_services/chat.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {

  @Input() chat: any;
  @Input() current_user_id: any;

  constructor(public chatService: ChatService) { }

  ngOnInit() {}

}
