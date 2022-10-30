import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletConnectComponentComponent } from './wallet-connect-component.component';

describe('WalletConnectComponentComponent', () => {
  let component: WalletConnectComponentComponent;
  let fixture: ComponentFixture<WalletConnectComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletConnectComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletConnectComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
