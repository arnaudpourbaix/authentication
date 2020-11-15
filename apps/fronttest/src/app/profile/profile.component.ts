import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile$ = this.http.get('v1/auth/profile');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}
}
