import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export const identityRevealedValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const patentExpirationDate = control.get('patentExpirationDate');
  const patentGrandDate = control.get('patentGrandDate');
  const patentFillingDate = control.get('patentFillingDate');

  return  ( patentExpirationDate.value <=  patentGrandDate.value || patentExpirationDate.value <=  patentFillingDate.value || patentGrandDate.value < patentFillingDate.value)
    ? { identityRevealed: true }
    : null;
};
