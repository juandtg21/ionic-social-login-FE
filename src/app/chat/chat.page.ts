import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  id: string;
  name: string;
  chats: Observable<any[]>;
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
  ) { }

  ngOnInit() {
    const data: any = this.route.snapshot.queryParams;
    console.log('data: ', data);
    if(data?.name) {
      this.name = data.name;
    }
    const id = this.route.snapshot.paramMap.get('id');
    console.log('check id: ', id);
    if(!id) {
      this.navCtrl.back();
      return;
    } 
    this.id = id;
    console.log(this.chats);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    console.log('scroll bottom');
    if(this.chats) this.content.scrollToBottom(500);
  }

  async sendMessage() {
  
  }

}
