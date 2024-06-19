import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
// import { AppUser } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserHttpRequestsService {
  private http: HttpClient = inject(HttpClient);

  storeUsers(userList: string[]): void {
    this.http.put('https://freespot-6e3c4-default-rtdb.europe-west1.firebasedatabase.app/userList.json/', userList).subscribe();
  }
}
