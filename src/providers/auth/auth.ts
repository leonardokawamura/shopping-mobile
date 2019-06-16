import {
  FirebaseAuthProvider
} from './firebase-auth';
import {
  HttpClient
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  Observable
} from 'rxjs/Observable';
import {
  fromPromise
} from 'rxjs/Observable/fromPromise'
import {
  flatMap,
  tap
} from 'rxjs/operators'
import {
  User
} from '../../app/model';
import {
  JwtHelperService
} from '@auth0/angular-jwt';
import {
  environment
} from '@app/env';

const TOKEN_KEY = 'code_shopping_token';

@Injectable()
export class AuthProvider {

  me: User = null;

  constructor(public http: HttpClient, private firebaseAuth: FirebaseAuthProvider) {
    const token = this.getToken();
    this.setUserFromToken(token);
  }

  login(): Observable < {
    token: string
  } > {
    return fromPromise(this.firebaseAuth.getToken())
      .pipe(
        flatMap(token => {
          return this.http
            .post < {
              token: string
            } > (`${environment.api.url}/login_vendor`, {
              token
            })
            .pipe(
              tap(data => {
                this.setToken(data.token);
              })
            );
        })
      );
  }

  setToken(token: string) {
    this.setUserFromToken(token);
    token ? window.localStorage.setItem(TOKEN_KEY, token) : window.localStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  isAuth(): boolean {
    const token = this.getToken();
    return !this.isTokenExpired(token);
  }

  logout(): Observable < any > {
    return this.http.post(`${environment.api.url}/logout`, {})
      .pipe(
        tap(() => {
          this.setToken(null);
        })
      );
  }

  private setUserFromToken(token: string) {
    const decodedPayload = new JwtHelperService().decodeToken(token);
    this.me = decodedPayload ? {
      id: decodedPayload.sub,
      name: decodedPayload.name,
      email: decodedPayload.email,
      role: decodedPayload.role,
      profile: decodedPayload.profile
    } : null;
  }

  isTokenExpired(token: string){
    return new JwtHelperService().isTokenExpired(token, 30);
  }

  refresh(): Observable<{token:string}>{
    return this.http.post<{token:string}>(this.refreshUrl(),{})
    .pipe(
      tap(data => {
        this.setToken(data.token)
      })
    )
  }

  refreshUrl(){
    return `${environment.api.url}/refresh`;
  }


}
