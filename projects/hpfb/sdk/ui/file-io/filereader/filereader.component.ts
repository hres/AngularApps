import {Component, OnInit, EventEmitter, Output, Input, SimpleChanges, ViewEncapsulation} from '@angular/core';
import { DRAFT_FILE_TYPE, FILE_TYPE_ERROR, FINAL_FILE_TYPE, FORM_TYPE_ERROR, IMPORT_SUCCESS, CHECK_SUM_ERROR} from '../file-io-constants';
import {TranslateService} from '@ngx-translate/core';
import { ConvertResults } from '../convert-results';
import {FileConversionService} from '../file-conversion.service';
import {CheckSumService} from '../../check-sum/check-sum.service';
import { CHECK_SUM_CONST } from '../../check-sum/check-sum-constants';

@Component({
  selector: 'lib-file-reader',
  templateUrl: './filereader.component.html',
  styleUrls: ['./filereader.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class FilereaderComponent implements OnInit {
  @Output() complete = new EventEmitter();
  @Input() rootTag : string = '';

  public status = IMPORT_SUCCESS;
  public importSuccess = false;
  public importedFileName = "";
  public showFileLoadStatus = false;
  private rootId = '';
  
  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
    console.log(this.rootTag);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['rootTag']) {
      this.rootId = changes['rootTag'].currentValue;
    }
  }

  /**
   * Attaches to the file browser, detecting the file selection change
   * @param $event
   */
  changeListener($event: any) {

    this.readSelectedFile($event.target);

  }

  /**
   * Determines if a file was selected. Sets a callback to process the file after load (asych)
   * @param inputValue
   */
  readSelectedFile(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();
    let self = this;
    myReader.onloadend = function (e) {
      // you can perform an action with data here callback for asynch load
      let convertResult = new ConvertResults();
      FilereaderComponent._readFile(file.name, myReader.result, self.rootId, convertResult);
      if (convertResult.messages && convertResult.messages.length > 0) {
        self.status = convertResult.messages[0];
      } else {
        self.status = IMPORT_SUCCESS;
      }

      if(self.status === IMPORT_SUCCESS){
        self.importSuccess = true;
        self.importedFileName = file.name;
      }
      self.showFileLoadStatus = true;
     
      self.complete.emit(convertResult);
    };
    if (file && file.name) {
      myReader.readAsText(file);
    }
  }

  /***
   * Processes the file data. Determines the type of file based on the filename suffix
   * @param name - the name of the file. Can include the path
   * @param result - the result of the file read i.e. file contents as text
   * @param rootId - the name of the rootTag. If null is ignored
   * @param {ConvertResults} convertResult -The results of the file read
   * @private
   */
  private static _readFile(name:string, result, rootId:string, convertResult:ConvertResults) {
    let splitFile = name.split('.');
    let fileType = splitFile[splitFile.length - 1];
    let conversion:FileConversionService =new FileConversionService();

    if ((fileType.toLowerCase()) === DRAFT_FILE_TYPE || fileType.toLowerCase() === FINAL_FILE_TYPE) {
      if ((fileType.toLowerCase()) === DRAFT_FILE_TYPE) {
        conversion.convertToJSONObjects(result, convertResult);
      } else {
        conversion.convertXMLToJSONObjects(result, convertResult);
      }
      // console.log(convertResult.data);
      if (convertResult.messages.length === 0) {
        FilereaderComponent.checkRootTagMatch(convertResult, rootId);
      }
      if(fileType.toLowerCase() === FINAL_FILE_TYPE){
        this.checkSumCheck(convertResult, rootId);
      }
    } else {
      convertResult.data = null;
      convertResult.messages=[]; //clear msessages
      convertResult.messages.push(FILE_TYPE_ERROR);
    }
  }
  private static checkRootTagMatch(convertResult:ConvertResults, rootName:string) {
    if (!rootName|| !convertResult ||!convertResult.data) return;

    if (!convertResult.data[rootName]) {
      convertResult.data = null;
      convertResult.messages = [];
      convertResult.messages.push(FORM_TYPE_ERROR);
    }
  }
  public refreshPage(){
    location.reload();
  }

  private static checkSumCheck(convertResult:ConvertResults, rootName:string) {  
    const checkSum: CheckSumService = new CheckSumService();

    if ((convertResult.data[rootName][CHECK_SUM_CONST] === null)) return;

    if(!checkSum.checkHash(convertResult.data)){
      convertResult.data = null;
      convertResult.messages = [];
      convertResult.messages.push(CHECK_SUM_ERROR);
    }
  }

}
