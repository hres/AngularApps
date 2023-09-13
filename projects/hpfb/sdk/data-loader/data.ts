// todo description of the class

export interface ICode {
  id: string;
  en: string;
  fr: string;
  sortPriority?: number;
}

export interface ICodeDefinition extends ICode {
  defEn: string;
  defFr: string;
}

export interface ICodeAria extends ICodeDefinition {
  ariaEn: string;
  ariaFr: string;
}

export interface IParentChildren {
  parentId: string;
  children: ICodeDefinition[];
}

export enum SortOn {
  ID,
  PRIORITY
}