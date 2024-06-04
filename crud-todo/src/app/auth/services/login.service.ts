import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonUrl } from 'src/app/shared/consts/commonUrl';
import { userReq, userRes } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  public login(data: userReq) {
    return this.http.post<userRes>(CommonUrl.MAIN_URL + CommonUrl.AUTH_URL + '/', data)
  }
}
