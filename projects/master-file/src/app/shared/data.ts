// represent json data structures

export interface ICode {
  id: string;
  en: string;
  fr: string;
}

export interface ICodeDefinition extends ICode {
  defEn: string;
  defFr: string;
}

export interface IParentChildren {
  parentId: string;
  children: ICodeDefinition[];
}
