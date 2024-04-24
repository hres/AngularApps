import {Component, Input, OnChanges, SimpleChanges,ViewEncapsulation, inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import { ValidationService } from '../../validation/validation.service';
import {TranslateService} from '@ngx-translate/core';
import { ErrMessageService } from '../err.message.service';

@Component({
  selector: 'control-messages',
  templateUrl: './control-messages.component.html',
  styleUrls: ['./control-messages.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class ControlMessagesComponent implements OnChanges {

  /**
   *  The reactive form control that this message relates
   */
  @Input() control: FormControl;
  /**
   * When true, indicates to show the error, even if control was not touched
   * @type {boolean}
   */
  @Input() showError: boolean;
  /**
   * Label message key that is associated to the control. Used for the error summary
   */
  @Input() label: string;
  /**
   * The id of the control. Used for the error summary to create the anchor link
   */
  @Input() controlId: string;
  /**
   * The id of the parent of the control. For the error summary componnet, currently not used?
   */
  @Input() parentId: string;
  /**
   * The label message key of the parent of hte control . Used for the error summary component. Currently not used?
   */
  @Input() parentLabel: string;
  /**
   * The already translated label of the parent of hte control . Used for the error summary component. 
   */
  @Input() translatedParentLabel: string;
  /***
   * Index of the error. Used to expand the expander for the error summaryt
   */
  @Input() index: Number;

   /**
   * Number of error from error summary
   */
   public errorNumber: string;
  /**
   * Flag to indicate if error summary
   */
  public errorSummaryFlag: boolean;   
  /**
   * Current error type for the control
   * @type {string}
   */
  public currentError: string ;
  /**
   *  A reference the tabset control NgbTabset from Angular bootstrap
   * @type {null}
   */
  // public tabSet: NgbTabset;
  /**
   * Th id of the target tab, the tab containing the error
   * @type (string)
   */
  public tabId: string;

  public errorParams: { [key: string]: string }= {};
  /**
   * controls visiblity
   * @type boolean
   */
  private _errorVisible: boolean;

   /**
   * Inputs for table level
   */
   @Input() tableId: string;
   @Input() type: string;
  
  constructor(private _errMessageService: ErrMessageService) {
    // this.tabSet = null;
    this.tabId = null;
    this._errorVisible = false;
  }

  /**
   * Change event processing from inputs
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {

    if (changes['showError']) {
      this._errorVisible = changes['showError'].currentValue;
      this.makeErrorVisible();
    }
  }

  /**
   * Gets the Error message key and its parameter values for a given error type.
   *
   * @returns {any}
   */
  get errorMessage() {
    for (let propertyName in this.control.errors) {
      this.currentError = propertyName;      
      // values to replace placeholders in the error message if they exist. eg "Minimum length {{ requiredLength }} numbers"
      this.errorParams = this.control.errors[propertyName];   
      // console.log(propertyName, Object.keys(this.errorParams).length, JSON.stringify(this.errorParams))

      return this._errMessageService.getValidatorErrorMessageKey(propertyName);
    }
    this.currentError = '';
    return null;
  }

  /**
   * Controls the visibility of an error
   * @returns {boolean}
   */
  makeErrorVisible() {
    const test = ((this.control.invalid && this.control.touched) || (this.control.invalid && this._errorVisible));
    return test;
  }

}



