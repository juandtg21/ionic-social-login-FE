import { Component, AfterViewInit, ViewChildren, ElementRef, QueryList, NgZone } from '@angular/core';
import { GestureController, IonCard, Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements AfterViewInit {

  @ViewChildren(IonCard, {read: ElementRef}) cards: QueryList<ElementRef>;
  longPressActive = false;

  constructor(private gestureCtrl: GestureController, private zone: NgZone, private platform: Platform) {}
  ngAfterViewInit(): void {
    const cardArray = this.cards.toArray();
    //this.onLongPress(cardArray);
    this.onSwipe(cardArray);
  }

  setCardColor(x, element) {
    let color = '';
    const abs = Math.abs(x);
    const min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16))
    const hexCode = this.decimalToHex(min, 1);
    if (x < 0) {
      color = '#FF' + hexCode + hexCode
    } else {
      color = '#' + hexCode + 'FF' + hexCode
    }
    element.style.background = color;
  }

  decimalToHex(d, padding): string {
    let hex = Number(d).toString(16);
    padding = typeof padding === 'undefined' || padding === null ? (padding = 2 ) : padding;

    while(hex.length < padding) {
      hex = '0' + hex;
    }
    return hex;
  }

  onLongPress(cardArray) {
    for (let i = 0; i < cardArray.length; i++) {
      const card = cardArray[i];
      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        gestureName: 'long-press',
        onStart: ev => {
          console.log('start');
          this.longPressActive = true;
          this.increasePower(i);
         
        },
        onEnd: ev => {
          this.longPressActive = false;
        }
      }, true);
      gesture.enable(true);
    }
  }

  increasePower(index) {
    console.log('increase')
    setTimeout(() => {
      if (this.longPressActive) {
        this.zone.run(() => {
          this.people[index].power++;
          this.increasePower(index);
        });
      }
    }, 200)
  }

  onSwipe(cardArray) {
    const windowWidth = window.innerWidth;
    for (let i = 0; i < cardArray.length; i++) {
      const card = cardArray[i];
      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        gestureName: 'swipe',
        onStart: (ev) => {
          card.nativeElement.transition = 'none';

        },
        onMove: (ev) => {
          card.nativeElement.style.transform = `translateX(${ev.deltaX}px) rotate(${ev.deltaX / 20}deg)`;
          //this.setCardColor(ev.deltaX, card.nativeElement);
        },
        onEnd: (ev) => {
          card.nativeElement.style.transition = '0.3s ease-out';
          if (ev.deltaX > windowWidth / 2) {
            card.nativeElement.style.transform = `translateX(${windowWidth * 1.5}px)`;
            if (card.nativeElement.style.transform = windowWidth * 1.5) {
              console.log("like")
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

  people = [
      {
        img: 'https://placeimg.com/300/300/people',
        name: "Demo card 1",
        description: "This is a demo for Tinder like swipe cards",
        power: 0
      },
      {
        img: 'https://placeimg.com/300/300/animals',
        name: "Demo card 2",
        description: "This is a demo for Tinder like swipe cards",
        power: 0
      },
      {
        img: 'https://placeimg.com/300/300/nature',
        name: "Demo card 3",
        description: "This is a demo for Tinder like swipe cards",
        power: 0
      },
      {
        img: 'https://placeimg.com/300/300/tech',
        name: "Demo card 4",
        description: "This is a demo for Tinder like swipe cards",
        power: 0
      },
      {
        img: 'https://placeimg.com/300/300/arch',
        name: "Demo card 5",
        description: "This is a demo for Tinder like swipe cards",
        power: 0
      }
    ]

}
