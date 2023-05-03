import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent  implements OnInit {

  @Input() item: any;
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  redirect() {
    console.log("RED:: " + JSON.stringify(this.item));
    this.onClick.emit(this.item);
  }
}
