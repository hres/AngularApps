import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { BaseComponent, HelpIndex, ICodeAria, UtilsService } from '@hpfb/sdk/ui';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalService } from '../global/global.service';
import { Ectd } from '../models/transaction';


import { AttestationComponent } from './attestation.component';

describe('AttestationComponent', () => {
  let component: AttestationComponent;
  let fixture: ComponentFixture<AttestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttestationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
