
import { Injectable } from '@angular/core';



@Injectable()
export class UtilService {


    static getSanitizedAmount(amountEntered: string) {
        const validAmountXter = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];

        if (!amountEntered) {
            return amountEntered;
        }


        const amountArray = amountEntered.toString().split('');
        let finalAmount = '';

        for (let cursor = 0; cursor < amountArray.length; cursor++) {
            if (validAmountXter.indexOf(amountArray[cursor]) !== -1) {

                if (finalAmount.indexOf('.') !== -1) {
                    const finalAmountArray = finalAmount.split('.');
                    if (finalAmountArray.length === 2 && finalAmountArray[1].length < 2) {
                        finalAmount += amountArray[cursor];
                    } else if (finalAmountArray.length === 1) {
                        finalAmount += amountArray[cursor];
                    }
                } else {
                    finalAmount += amountArray[cursor];
                }
            }
        }

        return finalAmount;
    }
}
