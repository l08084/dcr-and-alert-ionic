import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  public answer: string;

  constructor(private http: HttpClient) {}

  public callHttpRequest() {
    this.http
      .get(`https://yesno.wtf/api`)
      .subscribe((response: any) => (this.answer = response.answer));
  }
}
