
const verifyFitmentHeader = document.querySelector('.verify-fitment-title');
const qualityHeader = document.querySelector('.option-title-quality');
const vinHeader = document.querySelector('.option-title-vin');
const optionTitle = document.querySelector('.option-title');
const fitmentVerificationTitle = document.querySelector('.fitment-guarantee');
const oemVinContainer = document.querySelector('.oem-vin-container');
const productTypeSelect = document.getElementById('product-type-select');
const combinedVariantSelect = document.getElementById('variant-selector');
const vinVerificationCheckboxGroup = document.querySelector('.vin-verification-checkbox-group');
const vinVerifyCheckbboxYes = document.getElementById('fitment-yes');
const addToCartButton = document.getElementById('add-to-cart');
const addToCartForUnpainted = document.getElementById('add-to-cart-for-unpainted');
const paintOptionSelectPaintCodeLabel = document.getElementById('checkbox-select-paint-option');
// const paintOptionGetPaintByVINLabel = document.getElementById('checkbox-get-paint-code-with-vin');
const precisionMatchLabel = document.querySelector('.precision-match-guarantee');
const precisionMatchCheckboxYesLibrary = document.getElementById('precision-match');
const precisionMatchWrapperLibrary = document.querySelector('.product-page-precision-match-wrapper');



let currentAddToCartBtn;
if(addToCartButton) {
    currentAddToCartBtn = addToCartButton;
}
if(addToCartForUnpainted) {
    currentAddToCartBtn = addToCartForUnpainted;
}

//HiddenEl means that the user is currently going through the fitment process -- it not verified or unverified
let hiddenEl;
const fitmentHolder = document.querySelector('.easysearch-fitment-holder');
if (fitmentHolder && fitmentHolder.classList.contains('easysearch-hidden')) {
  hiddenEl = true;
} else {
  hiddenEl = false;
}

const COLORS = {
    red: '#e61b24',
    gray: '#ccc',
    black: '#333'
  };  



// Progressive header colors -- STEPS
function resetAllHeaderColors(fail) {
    // fail is a bool that determines color of fitment header based on whether or not the fitment is in focus
    if (fail) {
        if (verifyFitmentHeader) verifyFitmentHeader.style.color = COLORS.red;
    } else {
        if (verifyFitmentHeader) verifyFitmentHeader.style.color = COLORS.black;
    }
    if (qualityHeader) qualityHeader.style.color = COLORS.gray;
    if (vinHeader) vinHeader.style.color = COLORS.gray;
    if (optionTitle) optionTitle.style.color = COLORS.gray;
    if (fitmentVerificationTitle) fitmentVerificationTitle.style.color = COLORS.gray;
}            
function isFitmentVerified() {
    // No need for checks here as the fitment checker is present on all product pages
    const failEl = document.querySelector('.easysearch-fitment-fail');
    const successEl = document.querySelector('.easysearch-fitment-icon-success');
    return !!successEl && !failEl;
}
function getQualityHeaderColor() {
    const hasProductType = !!productTypeSelect;
    const hasCombinedVariant = !!combinedVariantSelect;
    const hasFitmentVerification = !!vinVerificationCheckboxGroup;
    const needsVin = oemVinContainer && oemVinContainer.style.display === "block";


    //If it does not needsVin, then the OEM option was not selected
    if(!needsVin) {
        if (hasProductType && hasCombinedVariant) {
            if(productTypeSelect.disabled === false && combinedVariantSelect.disabled === true) return COLORS.red;
            if(productTypeSelect.disabled === false && combinedVariantSelect.disabled === false) return COLORS.black;
        }
        if(hasProductType && !hasCombinedVariant && hasFitmentVerification) {
            if(productTypeSelect.disabled === false && vinVerifyCheckbboxYes.disabled === true) return COLORS.red;
            if(productTypeSelect.disabled === false && vinVerifyCheckbboxYes.disabled === false) return COLORS.black;
        }
        if (hasProductType && !hasCombinedVariant && !hasFitmentVerification) {
            if(productTypeSelect.disabled === false && currentAddToCartBtn.disabled === true) return COLORS.red;
            if(productTypeSelect.disabled === false && currentAddToCartBtn.disabled === false) return COLORS.black;
        }
    }
    //If it needsVin, then the OEM option was selected
    if(needsVin) {
        if (hasProductType) {
            if(productTypeSelect.disabled === false) return COLORS.black;
        }
    }
    return COLORS.gray; // gray
}
    
    
function isValidVin() {
    const hasCombinedVariant = !!combinedVariantSelect;
    const hasFitmentVerification = !!vinVerificationCheckboxGroup;

    //If it is present, deem if it is true or not... if it is not present, then it is not applicable so set it to true
    if(oemVinContainer) {
        const needsVin = oemVinContainer && oemVinContainer.style.display === "block";
        if(!failedVinDecode) {
            if(needsVin && hasCombinedVariant) {
                if(combinedVariantSelect.disabled === true) return COLORS.red;
                if(combinedVariantSelect.disabled === false) return COLORS.black;
            }
            if(needsVin && !hasCombinedVariant && hasFitmentVerification) {
                if(vinVerifyCheckbboxYes.disabled === true) return COLORS.red;
                if(vinVerifyCheckbboxYes.disabled === false) return COLORS.black;
            }
            if(needsVin && !hasCombinedVariant && !hasFitmentVerification) {
                if(currentAddToCartBtn.disabled === true) return COLORS.red;
                if(currentAddToCartBtn.disabled === false) return COLORS.black;
            }
        }
        return COLORS.gray;
    } else {
        return COLORS.black;
    }
}
function isPaintOptionSelected() {
    const hasProductType = !!productTypeSelect;
    const hasCombinedVariant = !!combinedVariantSelect;
    const hasFitmentVerification = !!vinVerificationCheckboxGroup;
    const hasPrecisionMatch = !!precisionMatchLabel;
    let precisionMatchWrapperIsShowing = false;
    if(precisionMatchWrapperLibrary) {
        precisionMatchWrapperIsShowing = precisionMatchWrapperLibrary.classList.contains('show')
    }


    
    let addToCartBtnDisabled = true;
    if(currentAddToCartBtn) addToCartBtnDisabled = currentAddToCartBtn.disabled;


    //If it is present, deem if it is true or not... if it is not present, then it is not applicable so set it to true
    if(hasFitmentVerification && !hasPrecisionMatch) {
        if (hasProductType && hasCombinedVariant) {
            if(productTypeSelect.disabled === false && combinedVariantSelect.disabled === false && vinVerifyCheckbboxYes.disabled === true) return COLORS.red;
            if(productTypeSelect.disabled === false && combinedVariantSelect.disabled === false && vinVerifyCheckbboxYes.disabled === false) return COLORS.black;
        } else if (!hasProductType && hasCombinedVariant) {
            if(combinedVariantSelect.disabled === false && vinVerifyCheckbboxYes.disabled === true) return COLORS.red;
            if(combinedVariantSelect.disabled === false && vinVerifyCheckbboxYes.disabled === false) return COLORS.black;
        }
    } else if(hasPrecisionMatch) {
        if(precisionMatchWrapperIsShowing) {
            if (hasProductType && hasCombinedVariant) {
                if(productTypeSelect.disabled === false && combinedVariantSelect.disabled === false && precisionMatchCheckboxYesLibrary.disabled === true) return COLORS.red;
                if(productTypeSelect.disabled === false && combinedVariantSelect.disabled === false && precisionMatchCheckboxYesLibrary.disabled === false) return COLORS.black;
            } else if (!hasProductType && hasCombinedVariant) {
                if(combinedVariantSelect.disabled === false && precisionMatchCheckboxYesLibrary.disabled === true) return COLORS.red;
                if(combinedVariantSelect.disabled === false && precisionMatchCheckboxYesLibrary.disabled === false) return COLORS.black;
            }
        } else {
            if (hasProductType && hasCombinedVariant) {
                if(productTypeSelect.disabled === false && combinedVariantSelect.disabled === false && vinVerifyCheckbboxYes.disabled === true) return COLORS.red;
                if(productTypeSelect.disabled === false && combinedVariantSelect.disabled === false && vinVerifyCheckbboxYes.disabled === false) return COLORS.black;
            } else if (!hasProductType && hasCombinedVariant) {
                if(combinedVariantSelect.disabled === false && vinVerifyCheckbboxYes.disabled === true) return COLORS.red;
                if(combinedVariantSelect.disabled === false && vinVerifyCheckbboxYes.disabled === false) return COLORS.black;
            }
        }
    } else {
        if (hasProductType && hasCombinedVariant) {
            if(productTypeSelect.disabled === false && combinedVariantSelect.disabled === false && addToCartBtnDisabled === true) return COLORS.red;
            if(productTypeSelect.disabled === false && combinedVariantSelect.disabled === false && addToCartBtnDisabled === false) return COLORS.black;
        } else if (!hasProductType && hasCombinedVariant) {
            if(combinedVariantSelect.disabled === false && addToCartBtnDisabled === true) return COLORS.red;
            if(combinedVariantSelect.disabled === false && addToCartBtnDisabled === false) return COLORS.black;
        }
    }
    return COLORS.gray;
}

function isVinVerified() {
    const hasProductType = !!productTypeSelect;
    const hasCombinedVariant = !!combinedVariantSelect;
    const hasFitmentVerification = !!vinVerificationCheckboxGroup;
    const hasPrecisionMatch = !!precisionMatchLabel;



    let addToCartBtnDisabled = true;
    if(currentAddToCartBtn) addToCartBtnDisabled = currentAddToCartBtn.disabled;

    if(hasPrecisionMatch) {
        if(vinVerifyCheckbboxYes.disabled === true) return COLORS.gray;
        if(vinVerifyCheckbboxYes.disabled === false && addToCartBtnDisabled === true) return COLORS.red;
        if(vinVerifyCheckbboxYes.disabled === false && addToCartBtnDisabled === false) return COLORS.black;
    } else {
        if (hasProductType && hasCombinedVariant) {
            if(productTypeSelect.disabled === false && combinedVariantSelect.disabled === false && vinVerifyCheckbboxYes.disabled === false && addToCartBtnDisabled === true) return COLORS.red;
            if(productTypeSelect.disabled === false && combinedVariantSelect.disabled === false && vinVerifyCheckbboxYes.disabled === false && addToCartBtnDisabled === false) return COLORS.black;
        } else if (!hasProductType && hasCombinedVariant) {
            if(combinedVariantSelect.disabled === false && vinVerifyCheckbboxYes.disabled === false && addToCartBtnDisabled === true) return COLORS.red;
            if(combinedVariantSelect.disabled === false && vinVerifyCheckbboxYes.disabled === false && addToCartBtnDisabled === false) return COLORS.black;
        } else if (hasProductType && !hasCombinedVariant) {
            if(productTypeSelect.disabled === false && vinVerifyCheckbboxYes.disabled === false && addToCartBtnDisabled === true) return COLORS.red;
            if(productTypeSelect.disabled === false && vinVerifyCheckbboxYes.disabled === false && addToCartBtnDisabled === false) return COLORS.black;
        } else if (!hasProductType && !hasCombinedVariant) {
            if(vinVerifyCheckbboxYes.disabled === false && addToCartBtnDisabled === true) return COLORS.red;
            if(vinVerifyCheckbboxYes.disabled === false && addToCartBtnDisabled === false) return COLORS.black;
        }
    }
    return COLORS.gray;
}

function isPrecisionMatchSelected() {
    const hasProductType = !!productTypeSelect;
    const hasCombinedVariant = !!combinedVariantSelect;
    const hasFitmentVerification = !!vinVerificationCheckboxGroup;
    const hasPrecisionMatch = !!precisionMatchLabel;

    //precisionMatchCheckboxYesLibrary



    let addToCartBtnDisabled = true;
    if(currentAddToCartBtn) addToCartBtnDisabled = currentAddToCartBtn.disabled;

    if(!hasFitmentVerification) {
        if (hasProductType && hasCombinedVariant) {
            if(productTypeSelect.disabled === false && combinedVariantSelect.disabled === false && precisionMatchCheckboxYesLibrary.disabled === false && addToCartBtnDisabled === true) return COLORS.red;
            if(productTypeSelect.disabled === false && combinedVariantSelect.disabled === false && precisionMatchCheckboxYesLibrary.disabled === false && addToCartBtnDisabled === false) return COLORS.black;
        } else if (!hasProductType && hasCombinedVariant) {
            if(combinedVariantSelect.disabled === false && precisionMatchCheckboxYesLibrary.disabled === false && addToCartBtnDisabled === true) return COLORS.red;
            if(combinedVariantSelect.disabled === false && precisionMatchCheckboxYesLibrary.disabled === false && addToCartBtnDisabled === false) return COLORS.black;
        } else if (hasProductType && !hasCombinedVariant) {
            if(productTypeSelect.disabled === false && addToCartBtnDisabled === true) return COLORS.red;
            if(productTypeSelect.disabled === false && addToCartBtnDisabled === false) return COLORS.black;
        } else if (!hasProductType && !hasCombinedVariant) {
            if(addToCartBtnDisabled === true) return COLORS.red;
            if(addToCartBtnDisabled === false) return COLORS.black;
        }
    } else {
        if (hasProductType && hasCombinedVariant) {
            if(productTypeSelect.disabled === false && combinedVariantSelect.disabled === false && precisionMatchCheckboxYesLibrary.disabled === false && vinVerifyCheckbboxYes.disabled === true) return COLORS.red;
            if(productTypeSelect.disabled === false && combinedVariantSelect.disabled === false && precisionMatchCheckboxYesLibrary.disabled === false && vinVerifyCheckbboxYes.disabled === false) return COLORS.black;
        } else if (!hasProductType && hasCombinedVariant) {
            if(combinedVariantSelect.disabled === false && precisionMatchCheckboxYesLibrary.disabled === false && vinVerifyCheckbboxYes.disabled === true) return COLORS.red;
            if(combinedVariantSelect.disabled === false && precisionMatchCheckboxYesLibrary.disabled === false && vinVerifyCheckbboxYes.disabled === false) return COLORS.black;
        } else if (hasProductType && !hasCombinedVariant) {
            if(productTypeSelect.disabled === false && vinVerifyCheckbboxYes.disabled === true) return COLORS.red;
            if(productTypeSelect.disabled === false && vinVerifyCheckbboxYes.disabled === false) return COLORS.black;
        } else if (!hasProductType && !hasCombinedVariant) {
            if(vinVerifyCheckbboxYes.disabled === true) return COLORS.red;
            if(vinVerifyCheckbboxYes.disabled === false) return COLORS.black;
        }
    }
    return COLORS.gray;
}




    // Progressive header colors main function
function updateProgressHeaderColors() {
    resetAllHeaderColors(false);
    let precisionMatchHeaderColor;
    let vinVerificationHeaderColor;
    
    if (!isFitmentVerified()) {
        if (verifyFitmentHeader) verifyFitmentHeader.style.color = COLORS.red;
        return;
    }
    
    const qualityHeaderColor = getQualityHeaderColor();
    if (qualityHeader) qualityHeader.style.color = qualityHeaderColor;
    
    const needsVin = oemVinContainer && oemVinContainer.style.display === "block";
    const vinHeaderColor = isValidVin(); 
    if (needsVin) {
        if (vinHeader) vinHeader.style.color = vinHeaderColor;
    }
    
    const paintOptionHeaderColor = isPaintOptionSelected();
    if (optionTitle) optionTitle.style.color = paintOptionHeaderColor;

    if(vinVerifyCheckbboxYes) {
        vinVerificationHeaderColor = isVinVerified();
    }
    if (fitmentVerificationTitle) fitmentVerificationTitle.style.color = vinVerificationHeaderColor;

    if(precisionMatchCheckboxYesLibrary) {
        precisionMatchHeaderColor = isPrecisionMatchSelected();
    }
    if (precisionMatchLabel) precisionMatchLabel.style.color = precisionMatchHeaderColor; 

}