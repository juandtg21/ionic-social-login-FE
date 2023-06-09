import { Component, AfterViewInit, ViewChildren, ElementRef, QueryList, NgZone, OnInit, AfterContentInit, AfterViewChecked } from '@angular/core';
import { GestureController, IonCard, Platform } from '@ionic/angular';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';
import { ChatService } from '../_services/chat.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements AfterViewInit, OnInit {

  @ViewChildren(IonCard, {read: ElementRef}) cards: QueryList<ElementRef>;
  longPressActive = false;
  people: any = [];

  constructor(private gestureCtrl: GestureController, 
    private tokenService: TokenStorageService, 
    private userService: UserService,
    private chatService: ChatService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  ngAfterViewInit(): void {
    this.cards.changes.subscribe(() => {
      const cardArray = this.cards.toArray();
      this.onSwipe(cardArray);
    });
  }

  onSwipe(cardArray) {
    const windowWidth = window.innerWidth;
    for (let i = 0; i < cardArray.length; i++) {
     
      const card = cardArray[i];
      const user = this.people[i];
      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        gestureName: 'swipe',
        onStart: (ev) => {
          card.nativeElement.transition = 'none';

        },
        onMove: (ev) => {
          card.nativeElement.style.transform = `translateX(${ev.deltaX}px) rotate(${ev.deltaX / 20}deg)`;
        },
        onEnd: (ev) => {
          card.nativeElement.style.transition = '0.3s ease-out';
          if (ev.deltaX > windowWidth / 2) {
            card.nativeElement.style.transform = `translateX(${windowWidth * 1.5}px)`;
            if (card.nativeElement.style.transform = windowWidth * 1.5) {
              console.log("like")
              this.chatService.createChatRoom(user.id).subscribe({
                next: () => {},
                error: err => {
                  console.error(err);
                }
              })
            }
          } else if (ev.deltaX < -windowWidth / 2) {
            card.nativeElement.style.transform = `translateX(-${windowWidth * 1.5}px)`;
            if (card.nativeElement.style.transform = windowWidth * 1.5) {
              console.log("unlike")
            }
          } else {
            card.nativeElement.style.transform = '';
          }
        }
      }, true);
      gesture.enable(true);
    }

  }

  getAllUsers() {
    const currentUser = this.tokenService.getUser().id;
    this.chatService.currentUserId = currentUser;
    this.userService.getAllUsers(currentUser).subscribe({
      next: data => {
        this.people = data;
      },
      error: err => {
        this.people = this.testPeople
      }
    })
  }

  handleRefresh(event) {
    this.getAllUsers();
    setTimeout(() => {
      const cardArray = this.cards.toArray();
      this.onSwipe(cardArray);
      event.target.complete();
    }, 2000);
  };

  testPeople = [
      {
        picture: 'https://placeimg.com/300/300/people',
        displayName: "Demo card 1",
        email: "This is a demo for Tinder like swipe cards",
        power: 0
      },
      {
        picture: 'https://placeimg.com/300/300/animals',
        displayName: "Demo card 2",
        email: "This is a demo for Tinder like swipe cards",
        power: 0
      },
      {
        picture: 'https://placeimg.com/300/300/nature',
        displayName: "Demo card 3",
        email: "This is a demo for Tinder like swipe cards",
        power: 0
      },
      {
        picture: 'https://placeimg.com/300/300/tech',
        displayName: "Demo card 4",
        email: "This is a demo for Tinder like swipe cards",
        power: 0
      },
      {
        picture: 'https://placeimg.com/300/300/arch',
        displayName: "Demo card 5",
        email: "This is a demo for Tinder like swipe cards",
        power: 0
      }
    ]



}
