import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export const identityRevealedValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const patendExpirationDate = control.get('patendExpirationDate');
  const patentGrandDate = control.get('patentGrandDate');
  const patentFillingDate = control.get('patentFillingDate');

  return  ( patendExpirationDate.value <=  patentGrandDate.value || patendExpirationDate.value <=  patentFillingDate.value || patentGrandDate.value < patentFillingDate.value)
    ? { identityRevealed: true }
    : null;
};
