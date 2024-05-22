import { Injectable } from '@angular/core';
import { IIdText, IIdTextLabel, ILabel } from './entity-base';

@Injectable()
export class EntityBaseService {
  getEmptyIdTextLabel(): IIdTextLabel {
    return {
      __text: '',
      _id: '',
      _label_en: '',
      _label_fr: '',
    };
  }

  getEmptyIIdText(): IIdText {
    return {
      __text: '',
      _id: '',
    };
  }

  getEmptyLabel(): ILabel {
    return {
      _label_en: '',
      _label_fr: '',
    };
  }

}
