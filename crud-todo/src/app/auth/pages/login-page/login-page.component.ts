import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Subject, takeUntil } from 'rxjs';
import { userReq, userRes } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent implements OnDestroy {

  constructor(
              private loginService: LoginService,
              private router: Router) {}
  public unsub$: Subject<boolean> = new Subject<boolean>();
  public loginUserLoading = false;

  public loginForm = new FormGroup({
    email: new FormControl<string>('', [ Validators.required, Validators.email ]),
    password: new FormControl<string>('', [ Validators.required ])
  })

  public login(): void {
    if(this.loginForm.valid) {
      const profileValues: userReq = {
        email: this.loginForm.get('email')?.value!,
        password: this.loginForm.get('password')?.value!
      };
      this.loginUserLoading = true;
      this.loginService.login(profileValues).pipe(
        takeUntil(this.unsub$),
      ).subscribe( {
        next: (data) => {
          this.loginUserLoading = false;
          localStorage.setItem('token', data.token);
          this.router.navigate(['/home']);
        },
        error: () => {
          this.loginUserLoading = false;
        }
      })
    }
  }

  ngOnDestroy(): void {
      this.unsub$.next(true);
      this.unsub$.complete();
  }
}
