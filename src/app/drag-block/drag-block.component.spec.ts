import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragBlockComponent } from './drag-block.component';

describe('DragBlockComponent', () => {
  let component: DragBlockComponent;
  let fixture: ComponentFixture<DragBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
