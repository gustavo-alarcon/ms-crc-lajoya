import { AbstractControl } from '@angular/forms'



export function typeValidator(
  control: AbstractControl
): { [key: string]: any } | null {

  let valid = false;

  switch (control.value) {
    case 'Acto sub-estandar':
      valid = true;
      break;

    case 'Condición sub-estandar':
      valid = true;
      break;

    case 'Acto destacable':
      valid = true;
      break;
  
    default:
      valid = false;
      break;
  }
  
  return valid
    ? null
    : { invalidType: { valid: false, value: control.value } }
}