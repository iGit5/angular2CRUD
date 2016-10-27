import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { User } from './user';
import { UserService } from './user.service';

@Component({
  moduleId: module.id,
  selector: 'my-user-detail',
  templateUrl: 'user-detail.component.html',
  styleUrls: ['user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @Input() user: User;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  constructor(
    private userService: UserService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = +params['id'];
        this.navigated = true;
        this.userService.getUser(id)
            .then(user => this.user = user);
      } else {
        this.navigated = false;
        this.user = new User();
      }
    });
  }

  save(): void {
    this.userService
        .save(this.user)
        .then(user => {
          this.user = user; // saved user, w/ id if new
          this.goBack(user);
        })
        .catch(error => this.error = error); // TODO: Display error message
  }

  goBack(savedUser: User = null): void {
    this.close.emit(savedUser);
    if (this.navigated) { window.history.back(); }
  }
}
