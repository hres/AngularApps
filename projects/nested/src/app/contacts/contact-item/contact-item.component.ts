import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, OnInit, QueryList, ViewChildren, effect, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContactStatus, ControlMessagesComponent, ErrorModule, PipesModule } from '@hpfb/sdk/ui';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../global/global.service';

@Component({
  selector: 'app-contact-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, ErrorModule, PipesModule],
  templateUrl: './contact-item.component.html',
  encapsulation: ViewEncapsulation.None
})

export class ContactItemComponent implements OnInit, AfterViewInit {
  @Input() cRRow: FormGroup;
  @Input() j: number;

  @Output() saveRecord = new EventEmitter();
  @Output() revertRecord = new EventEmitter();
  @Output() deleteRecord = new EventEmitter();

  isInternal: boolean
  showErrors: boolean;
  showErrSummary: boolean = false;
  translatedParentLabel: string;

  @Output() errorList = new EventEmitter(true);
  @ViewChildren(ControlMessagesComponent) msgList: QueryList<ControlMessagesComponent>;

  constructor(private _globalService: GlobalService){
    this.isInternal = this._globalService.$isInternal;
    this.translatedParentLabel = 'todo';

    effect(() => {
      this.showErrors = this._globalService.showErrors()
      console.log('[effect]', this.showErrors, this._globalService.showErrors())
      if (this._globalService.showErrors()) {
        this._updateErrorList(this.msgList);
      }
    });
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    
  }

  private _updateErrorList(errorObjs) {
    const temp = [];
    if (errorObjs) {
      errorObjs.forEach(
        error => {
          temp.push(error);
        }
      );
    }
    this.errorList.emit(temp);

  }

  public revertContactRecord(index: number, recordId: number): void {
    this.revertRecord.emit({ index: index, id: recordId });
    this.cRRow.markAsPristine();
  }

  public deleteContactRecord(index: number): void {
    this.deleteRecord.emit(index);  
  }

  public setStatusToRevise(index: number): void {
    this._save(index, ContactStatus.Revise)
  }

  public setStatusToRemove(index: number): void {
    // this._detailsService.setFormContactStatus(this.contactDetailsForm, ContactStatus.Remove, this.contactStatusList, this.lang, true);
    // this.saveContactRecord();
  }  

  public activeContactRecord(index: number): void {
    this._save(index, ContactStatus.Active)
  }

  public saveContactRecord(index: number): void {
    this._save(index);
  }

  private _save(index: number, contactStatus?: ContactStatus): void {
    if (this.cRRow.valid) {
      this.saveRecord.emit({ index: index, contactStatus: contactStatus });
      this.cRRow.markAsPristine();
    } else {
      this.showErrSummary = true;
      this.showErrors = true;
    }
  }  

  public showErrorSummary(): boolean {
    return (this.showErrSummary && this.errorList.length > 0);
  }
  
  // todo use include, not !Remove
  // public isActiveContact(): boolean {
  //   return (!this.isContactStatus(ContactStatus.Remove));
  // }

  public isNewContact(): boolean {
    return (this.isContactStatus(ContactStatus.New));
  }

  public isContactSetToRemove(): boolean {
    return (this.isContactStatus(ContactStatus.Remove));
  }

  private isContactStatus(status: ContactStatus) {
    const contStatusValue = this.cRRow.get('contactInfo.status').value;
    return contStatusValue===status;
  }
}


