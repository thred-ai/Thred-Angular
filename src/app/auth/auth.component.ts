import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadService } from '../load.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  mode = 0;
  loading = false;

  err?: string;

  signUpForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required],
    confirmPass: [null, Validators.required],
  });

  signInForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required],
  });

  passResetForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private loadService: LoadService,
    @Inject(PLATFORM_ID) private platformID: Object
  ) {}

  continue() {
    this.loading = true
    this.beginAuth((result) => {
      this.loading = false
      if (result.status) {
      } else {
        this.err = result.msg;
      }
    });
  }

  private beginAuth(
    callback: (result: { status: boolean; msg: string }) => any
  ) {
    var form: FormGroup;

    switch (this.mode) {
      case 0:
        form = this.signUpForm;

        let conditions0 = [
          {
            condition: (form.controls['password'].value.length ?? 0) >= 6,
            msg: 'Password not long enough',
          },
          {
            condition:
              form.controls['password'].value ==
              form.controls['confirmPass'].value,
            msg: 'Passwords do not match',
          },
        ];
        let isValid0 = this.validateForm(form, conditions0);

        if (isValid0.status) {
          this.handleSignUp(form, (result) => {
            callback(result);
          });
        } else {
          callback(isValid0);
        }
        return;
      case 1:
        form = this.signInForm;
        let conditions1 = [
          {
            condition: (form.controls['password'].value.length ?? 0) >= 6,
            msg: 'Invalid password',
          },
        ];
        let isValid1 = this.validateForm(form, conditions1);
        if (isValid1.status) {
          this.handleSignIn(form, (result) => {
            callback(result);
          });
        } else {
          callback(isValid1);
        }
        return;
      case 2:
        form = this.passResetForm;
        let isValid2 = this.validateForm(form);
        if (isValid2.status) {
          this.handlePassReset(form, (result) => {
            callback({ status: false, msg: 'Check your email for a link!' });
          });
        } else {
          callback(isValid2);
        }
        return;
      default:
        return;
    }
  }

  private validateForm(
    form: FormGroup,
    extra: { condition: boolean; msg: string }[] = []
  ) {
    let invalidConditions = extra.filter((val) => val.condition == false);
    if (form.valid && invalidConditions.length == 0) {
      return { status: true, msg: '' };
    } else {
      if (!form.valid) {
        return { status: false, msg: 'Missing required fields' };
      } else if (invalidConditions.length > 0) {
        return {
          status: false,
          msg: invalidConditions.map((c) => c.msg).join(', '),
        };
      }
      return { status: false, msg: 'Missing required fields' };
    }
  }

  private handleSignUp(
    form: FormGroup,
    callback: (result: { status: boolean; msg: string }) => any
  ) {
    let email = form.controls['email'].value;
    let password = form.controls['password'].value;

    this.loadService.finishSignUp(email, password, (result) => {
      callback(result);
    });
  }

  private handleSignIn(
    form: FormGroup,
    callback: (result: { status: boolean; msg: string }) => any
  ) {
    let email = form.controls['email'].value;
    let password = form.controls['password'].value;

    this.loadService.finishSignIn(email, password, (result) => {
      callback(result);
    });
  }

  private handlePassReset(
    form: FormGroup,
    callback: (result: { status: boolean; msg: string }) => any
  ) {
    let email = form.controls['email'].value;
  }

  ngOnDestroy(): void {
    window.onclick = null;
  }

  ngOnInit(): void {
    window.onclick = (e) => {
      if (isPlatformBrowser(this.platformID)) {
        if ((e.target as any).id != 'continue') {
          this.err = undefined;
        }
      }
    };
  }
}
