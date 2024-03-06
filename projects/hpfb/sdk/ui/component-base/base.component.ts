import { AfterViewInit, Directive, QueryList, ViewChildren } from "@angular/core";
import { ControlMessagesComponent } from "../error-msg/control-messages/control-messages.component";

@Directive()
export abstract class BaseComponent implements AfterViewInit {
  
  @ViewChildren(ControlMessagesComponent) protected msgList: QueryList<ControlMessagesComponent>;

  constructor() { }

  ngAfterViewInit(): void {
    this.msgList.changes.subscribe(errorObjs => {
      let temp = [];
      if (errorObjs) {
        errorObjs.forEach(
          error => {
            temp.push(error);
          }
        );
      }
      this.emitErrors(temp);
    });
    this.msgList.notifyOnChanges();
  }

  protected abstract emitErrors(errors: any[]): void;
}