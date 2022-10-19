import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartUtilComponent } from './smart-util.component';

describe('SmartUtilComponent', () => {
  let component: SmartUtilComponent;
  let fixture: ComponentFixture<SmartUtilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartUtilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
