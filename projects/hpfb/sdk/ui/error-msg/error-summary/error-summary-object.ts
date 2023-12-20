
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


  /**
   * Creates a flat json object for the error summary component UI
   * @returns {object}
   */
  export function getEmptyErrorSummaryObj(): ErrorSummaryObject {
    return {
      index: -1,
      label: '',
      controlId: '',
      error: '',
      type: '',
      // tabSet: null,
      tabId: -1,
      componentId: '',
      tableId: '',
      expander: null,
      compRef: null,
      errorNumber: ''
    };
  }