import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  authForm = this.fb.group({
    email: [null, Validators.required],
    password: [null, Validators.required],
    confirmPass: [null, Validators.required],
  });

  constructor(private fb: FormBuilder) { }

  mode = 0

  ngOnInit(): void {
  }

}
