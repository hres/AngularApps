import {AfterViewInit, ChangeDetectorRef, Component, Input, SimpleChanges, ViewEncapsulation, inject} from '@angular/core';
import { ExpanderComponent } from '../../expander/expander.component';
import {ErrorSummaryObject, ERR_TYPE_COMPONENT, ERR_TYPE_LEAST_ONE_REC, getEmptyErrorSummaryObj} from './error-summary-object';
import { ErrMessageService } from '../err.message.service';

@Component({
  selector: 'lib-error-summary',
  templateUrl: './error-summary.component.html',
  styleUrls: ['./error-summary.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ErrorSummaryComponent implements AfterViewInit {
  @Input() headingPreamble: string;
  @Input() errorList;
  @Input() hiddenSummary;
  @Input() compId = 'error-summary-';
  @Input() label: string;
  @Input() headingLevel: string;

  public type: string;

  public errors = {};
  public componentId = '';
  public tableId = '';
  public hdingLevel = 'h1';
  public index: number;
  public expander: ExpanderComponent ;
  public errorCount: number;

  public errorNumberValue : string = '';

  constructor(private cdr: ChangeDetectorRef, private _errMessageService: ErrMessageService) {
    this.type = ERR_TYPE_COMPONENT;
    this.index = -1;
    this.expander = null;
  }

  ngAfterViewInit() {
    if (this.cdr) {
      this.cdr.detectChanges();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['errorList']) {
      this.processErrors(changes['errorList'].currentValue);
      // console.log("........process errors in error summary ");
      // console.log(changes['errorList'].currentValue)
    }
    if (changes['compId']) {
      this.componentId = changes['compId'].currentValue;
    }
    if (changes['headingLevel']) {
      this.hdingLevel = changes['headingLevel'].currentValue;
    }
  }

  /**
   * Creates an array of error elements based on the incoming error objects
   * Currently groups the errors by parent. Not doing anything with parent right now.
   * But could display errors groupded by the parent and parent label
   * @param errorList
   */
  public processErrors(errorList): void {
    this.errors = {};
    if (!errorList) {
      return;
    }
    // console.log(errorList);
    for (let err of errorList) {
      if (!err) { continue; }
      let controlError: ErrorSummaryObject = getEmptyErrorSummaryObj();
      controlError.index = 1;
      controlError.label = err.label;
      controlError.controlId = err.controlId;
      controlError.error = err.currentError;
      controlError.type = err.type;
      // controlError.tabSet = err.tabSet;
      controlError.tabId = err.tabId;
      controlError.componentId = err.componentId; // error summary only uses this
      controlError.expander = err.expander; // error summary only uses
      controlError.compRef = err;

      err.errorNumber = this.errorCount;
      controlError.errorNumber = err.errorNumber;

      // if (err.controlId === 'hasMaterial') {
      //   err.type = ERR_TYPE_LEAST_ONE_REC;
      //   err.tableId = 'materialListTable';
      // }
      // Case 1: an error summary Component
      if (err.hasOwnProperty('type') &&
        (err.type === ERR_TYPE_COMPONENT || err.type === ERR_TYPE_LEAST_ONE_REC)) {
        if (err.tableId) { // replace componentId with table ID
          controlError.tableId = err.tableId;
        }
        let parentError = {parentLabel: '', index: -1, controls: []};
        parentError.parentLabel = err.componentId;
        parentError.index = err.index;
        parentError.controls.push(controlError); //TODO needed for eerror summary
        this.errors[err.componentId] = parentError;
      } else {
        // Case 2 Not an error summary. If has a parentId gourp the errors
        if (this.errors.hasOwnProperty(err.parentId)) {
          let id = err.parentId;
          this.errors[id].controls.push(controlError);
        } else {
          // create a parent tag and put errors under the controls list
          let parentError = {parentLabel: '', controls: []};
          parentError.parentLabel = err.parentLabel;
          parentError.controls.push(controlError);
          this.errors[err.parentId] = parentError;
        }
      }
      this.errorCount++;
    }
    this.resetErrorCount();
    //console.log(this.errors);
  }

  /**
   * Selects thje tab from an ngbTabset
   * @param error- the error object created by the summary component
   */
  public processEvents(error) {
    //process tab Events first. Assunming rhere are no tabs inside an expander
    // if (error && error.tabSet && error.tabId) {
    //   error.tabSet.select(error.tabId);
    // }
    //expander if needed
    if (error && error.expander && error.index > -1) {
      if (!error.expander.getExpandedState(error.index)) {
        error.expander.selectTableRow(error.index);
      }
    }
  }

  private resetErrorCount(){
    this.errorCount = 1;
  }

  getValidatorErrorMessageKey(error: string){
    return this._errMessageService.getValidatorErrorMessageKey(error);
  }
  
}
