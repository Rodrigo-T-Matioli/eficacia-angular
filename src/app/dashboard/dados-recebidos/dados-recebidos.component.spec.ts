import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosRecebidosComponent } from './dados-recebidos.component';

describe('DadosRecebidosComponent', () => {
  let component: DadosRecebidosComponent;
  let fixture: ComponentFixture<DadosRecebidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DadosRecebidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DadosRecebidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
