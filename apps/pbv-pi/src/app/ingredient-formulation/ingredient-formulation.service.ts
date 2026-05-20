import { Injectable, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConverterService, UtilsService } from '@hpfb/sdk/ui';
import { GlobalService } from '../global/global.service';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class IngredientFormulationService {

    constructor(private _utilsService : UtilsService,
        private _converterService : ConverterService,
        private _globalService : GlobalService) {}

    _translateService = inject(TranslateService);
    ingredientFormArrValue = signal<any[]>([]);


    createRecordFormGroup(fb: FormBuilder): FormGroup<any> {
        if (!fb) {
            return null;
        }
    
        return fb.group({
            id: -1,
            recordId: -1, // Used to assign an id to record when it's first created
            isNew: true,
            expandFlag: true,
            lastSavedState: null, // store the last saved state of the contactInfo for reverting function
            heading: null,
            ingredientFormulation: fb.group({
                role: ['', Validators.required],
                ingredientName: ['', Validators.required],
                attestDetails: [''],
                attestInformation: [''],
                formulationVariantName: [''],
                purpose: [''],
                chemicalService: [''],
                standard: [''],
                operator: [''],
                operatorValue: [''],
                lowerLimit: [''],
                upperLimit: [''],
                units: [''],
                unitsOther: [''],
                per: [''],
                perValue: [''],
                unitOfMeasure: [''],
                measureOtherDetails: [''],
                unitOfPresentation: [''],
                calculatedBase: [''],
                isNanomaterial: [''],
                nanomaterial: [''],
                nanomaterialType: [''],
                isAnimalHumanSourced: ['']
                }, { updateOn: 'change' }
            )
        });
    }

    setRecordsFormArrValue(val: any[]): void {
        this.ingredientFormArrValue.set(val);
    } 

    public async getHeading(index : number, formGroup : FormGroup): Promise<string> {
        let fullHeading = '';
        let ingredientName = null;
        const id = index + 1;

        if (formGroup.get('id').value !== -1) {
            ingredientName = formGroup.get('ingredientFormulation.ingredientName')?.value?.trim() ?? '';
        }
    
        const heading = await lastValueFrom(
          this._translateService.get('heading.form.ingredient', { seqnumber: id })
        );
        fullHeading = ingredientName ? `${heading} - ${ingredientName}` : heading;
          
        return fullHeading;
    }
}