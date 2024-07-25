import { Injectable } from '@angular/core';
import  * as CryptoJS from 'crypto-js';
import {FileConversionService} from '../file-io/file-conversion.service';
import { ConvertResults } from '../file-io/convert-results';
import { CHECK_SUM_CONST } from './check-sum-constants';

@Injectable({
  providedIn: 'root'
})

export class CheckSumService {

  constructor() {}

  checkHash(convertResultData: any): Boolean {
    
    for(const key in convertResultData){

      if(convertResultData.hasOwnProperty(key)){

        for(const seckey in convertResultData[key]){

          if(convertResultData[key].hasOwnProperty(seckey)){

            if(seckey === CHECK_SUM_CONST){
              let hashFromFile = convertResultData[key][seckey];
              convertResultData[key][seckey] = "";
              let hash = CryptoJS.MD5(JSON.stringify(convertResultData));
            
              if(hash.toString(CryptoJS.enc.MD5) === hashFromFile){
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  createHash(result: any): string{

    let fileConversion = new FileConversionService();
    let xResult = fileConversion.convertJSONObjectsToXML(result);
    let cr: ConvertResults = new ConvertResults();

    fileConversion.convertXMLToJSONObjects(xResult, cr);
    result = cr.data;

    const hash = CryptoJS.MD5(JSON.stringify(result));
    return hash.toString(CryptoJS.enc.MD5);

  }

}