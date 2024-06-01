
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const passwordControl = control.get(passwordKey);
        const confirmPasswordControl = control.get(confirmPasswordKey);

        if (passwordControl && confirmPasswordControl && passwordControl.value !== confirmPasswordControl.value) {
            if (confirmPasswordControl) {
                confirmPasswordControl.setErrors({ passwordMismatch: true });
            }
            return { passwordMismatch: true };
        } else {
            if (confirmPasswordControl) {
                confirmPasswordControl.setErrors(null);
            }
            return null;
        }
    };
}
