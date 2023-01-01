import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNftComponent } from './add-nft.component';

describe('AddNftComponent', () => {
  let component: AddNftComponent;
  let fixture: ComponentFixture<AddNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
