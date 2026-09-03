import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TuiButton, TuiIcon, TuiInput, TuiNotificationService} from '@taiga-ui/core';
import {TuiPassword} from '@taiga-ui/kit';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, TuiButton, TuiIcon, TuiInput, TuiPassword],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(TuiNotificationService);

  protected readonly form = new FormGroup({
    username: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9]+$/)],
    }),
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {username, password} = this.form.getRawValue();
    if (!this.auth.login(username.trim(), password)) {
      this.notifications.open('Проверьте логин и пароль и попробуйте ещё раз.', {
        label: 'Не удалось войти',
        appearance: 'negative',
      }).subscribe();
      return;
    }

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    void this.router.navigateByUrl(returnUrl?.startsWith('/') ? returnUrl : '/dashboard');
  }
}
