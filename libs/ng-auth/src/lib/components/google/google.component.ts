import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'apx-auth-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.scss'],
})
export class GoogleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isLogged = this.route.snapshot.queryParams['status'] === 'success';

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
