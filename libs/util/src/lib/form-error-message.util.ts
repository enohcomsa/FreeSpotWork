import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormErrorMessage {
  private _translateService: TranslateService = inject(TranslateService);

  public displayFormErrorMessage(control: AbstractControl | null): string {
    if (control && control.errors && control.touched) {
      switch (Object.keys(control.errors)[0]) {
        case 'required':
          return this._translateService.instant('FORM_ERROR.FIELD_REQUIRED');
        case 'email':
          return this._translateService.instant('FORM_ERROR.EMAIL');
        case 'minlength':
          return this._translateService.instant('FORM_ERROR.MIN_CHARACTERS', {
            charNumber: control.getError('minlength').requiredLength,
          });
      }
    }
    return '';
  }
}
