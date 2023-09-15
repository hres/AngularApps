
import { ExpanderComponent } from '../../expander/expander.component';

export interface ErrorSummaryObject {

  index: number;
  label: string;
  controlId: string;
  error: string;
  type: string;
  // tabSet: NgbTabset;
  tabId:number,
  componentId: string;
  tableId: string;
  expander: ExpanderComponent;
  compRef;
}
