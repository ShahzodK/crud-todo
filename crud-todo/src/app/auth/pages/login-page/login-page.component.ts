import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Subject, takeUntil } from 'rxjs';
import { userReq, userRes } from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {

  constructor(
              private loginService: LoginService,
              private toastr: ToastrService) {}
  public unsub$: Subject<boolean> = new Subject<boolean>();

  public loginForm = new FormGroup({
    email: new FormControl<string>('', [ Validators.required ]),
    password: new FormControl<string>('', [ Validators.required ])
  })

  public login(): void {
    if(this.loginForm.valid) {
      const profileValues: userReq = {
        email: this.loginForm.get('email')?.value!,
        password: this.loginForm.get('password')?.value!
      }
      this.loginService.login(profileValues).pipe(
        takeUntil(this.unsub$)
      ).subscribe({
        next: (data: userRes) => {
          localStorage.setItem('token', data.token);
        },
        error: (error) => {
          console.log(error);
          this.toastr.error('Error', error.error.message)
        }
      })
    }
  }
}
