
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
  errorNumber:string;
}

export const ERR_TYPE_COMPONENT: string = 'component_error'; 
export const ERR_TYPE_LEAST_ONE_REC: string = 'least_one_rec_error';
