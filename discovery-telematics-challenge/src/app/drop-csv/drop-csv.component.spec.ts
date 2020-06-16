import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropCsvComponent } from './drop-csv.component';

describe('DropCsvComponent', () => {
  let component: DropCsvComponent;
  let fixture: ComponentFixture<DropCsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropCsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
