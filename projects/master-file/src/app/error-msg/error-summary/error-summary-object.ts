import {ExpanderComponent} from '../../common/expander/expander.component';
import {NgbNav} from '@ng-bootstrap/ng-bootstrap';

export interface ErrorSummaryObject {

  index: number;
  label: string;
  controlId: string;
  error: string;
  type: string;
  tabSet: NgbNav;
  tabId:number,
  componentId: string;
  tableId: string;
  expander: ExpanderComponent;
  compRef;
  minLength: string;
}
