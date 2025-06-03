import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoTransacaoComponent } from './historico-transacao.component';

describe('HistoricoTransacaoComponent', () => {
  let component: HistoricoTransacaoComponent;
  let fixture: ComponentFixture<HistoricoTransacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoTransacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoTransacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
