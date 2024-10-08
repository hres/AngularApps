import { AfterViewInit, ChangeDetectorRef, Directive, QueryList, ViewChildren } from "@angular/core";
import { ControlMessagesComponent } from "../error-msg/control-messages/control-messages.component";

@Directive()
export abstract class BaseComponent implements AfterViewInit {
  
  @ViewChildren(ControlMessagesComponent) protected msgList: QueryList<ControlMessagesComponent>;

  constructor() { }

  ngAfterViewInit(): void {
    this.msgList.changes.subscribe(errorObjs => {
      this._updateAndEmitErrors(errorObjs);
    });
    this.msgList.notifyOnChanges();
  }

  protected _updateAndEmitErrors(errorObjs) {
    const temp = [];
    if (errorObjs) {
      errorObjs.forEach(
        error => {
          temp.push(error);
        }
      );
    }
    this.emitErrors(temp);
  }

  // append errors from child component
  protected _appendErrorsFromChild(errorsFromChild: ControlMessagesComponent[]) {
    const parentErrors = this.msgList.toArray();
    const combinedErrors = [...parentErrors, ...errorsFromChild];
    this.emitErrors(combinedErrors);  // Call the abstract method
  }

  protected abstract emitErrors(errors: any[]): void;
}