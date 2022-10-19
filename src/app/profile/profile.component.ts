import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProfileComponent>
  ) {
    this.profileForm.controls['url'].setValue(
      data.dev?.url ? data.dev?.url : null
    );
    this.profileForm.controls['name'].setValue(data.dev?.name);
    this.profileForm.controls['email'].setValue(data.dev?.email);
  }

  profileForm = this.fb.group({
    name: [null, Validators.required],
    url: [null, Validators.required],
    email: [null, Validators.required],
  });

  close() {
    this.dialogRef.close();
  }

  async fileChangeEvent(event: any): Promise<void> {
    console.log(event);

    let file = event.target.files[0];

    let buffer = await file.arrayBuffer();

    var blob = new Blob([buffer]);

    var reader = new FileReader();
    reader.onload = (event: any) => {
      var base64 = event.target.result;
        this.profileForm.controls['url'].setValue(base64);
    };

    reader.readAsDataURL(blob);

    console.log(file);
  }

  ngOnInit(): void {}


}
