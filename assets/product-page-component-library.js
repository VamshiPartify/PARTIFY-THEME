/*******************************************************************************************************
**                                                                                                    **
**                                             VARIABLES                                              **
**                                                                                                    **
*******************************************************************************************************/


const addToCartButtonLibrary = document.getElementById('add-to-cart');
const addToCartForUnpaintedLibrary = document.getElementById('add-to-cart-for-unpainted');
const checkboxGetPaintCodeWithVINAndLabel = document.querySelector('input#checkbox-get-paint-code-with-vin')?.closest('label');
const combinedVariantSelectLibrary = document.getElementById('variant-selector');
const form = document.getElementById('product-form');
const getPaintCodeUsingVinLibrary = document.querySelector('.get-paint-code-using-vin');
const howToFindPaintCodeBtnLibrary = document.getElementById('how-to-find-your-paint-code-vindecoder');
const oemVinContainerLibrary = document.querySelector('.oem-vin-container');
const paintedStockKeyLibrary = document.querySelector('.painted-stock-key');
const paintCodeAppContainerLibrary = document.getElementById('paintcode-app-container');
const paintCodeWrapperLibrary = document.querySelector(".paint-code-wrapper");
const paintOptionCheckboxByPaintCode = document.getElementById('checkbox-select-paint-option');
const paintOptionCheckboxByUnpainted = document.getElementById('checkbox-select-unpainted');
const paintOptionCheckboxByVIN = document.getElementById('checkbox-get-paint-code-with-vin');
const paintOptionsButtonsLibrary = document.querySelector('.paint-options-buttons');
const paintOptionsIndividualButtonsLibrary = document.querySelectorAll('.paint-option-button');
const precisionMatchContainerLibrary = document.querySelector('.precision-match-container');
const precisionMatchCheckboxYes = document.getElementById('precision-match');
const precisionMatchCheckboxNo = document.getElementById('standard-match');
const precisionMatchButton = document.getElementById('precision-match-button');
const precisionMatchInputBox = document.getElementById('precision-match-textbox');
const precisionMatchVinWrapper = document.getElementById('precision-match-textbox-wrapper');
const priceContainerLargeScreen = document.querySelector('.price-container-large-screen');
const priceContainerSmallScreen = document.querySelector('.price-container');
const priceDisplay = document.getElementById('price-display');
const priceDisplaySmallScreen = document.getElementById('price-display-small-screen');
const qualityTypeButtonsLibrary = document.querySelector('.quality-type-buttons');
const qualityOptionsLibrary = document.querySelectorAll('.quality-option');
const qualityDescriptionBtnLibrary = document.getElementById('quality-description-vindecoder');
const selectVinVariantButtonLibrary = document.getElementById('select-vin-variant');
const vinVerificationWrapper = document.getElementById('vin-textbox-for-verification-wrapper');
const vinVerificationInput = document.getElementById('vin-textbox-for-verification');
const vinInputLibrary = document.querySelector('#vin-textbox');
const vinTextBoxOEMLibrary = document.getElementById('vin-textbox-for-oem');
const vinTextboxContainer = document.getElementById("vin-textbox-container");
const vinVerificationCheckboxGroupLibrary = document.querySelector('.vin-verification-checkbox-group');
const vinVerifyCheckbboxYesLibrary = document.getElementById('fitment-yes');
const vinVerifyCheckboxNoLibrary = document.getElementById('fitment-no');
const vinVerificationButtonLibrary = document.getElementById('vin-verification-button');

let emptyVinVerificationRadioButtons = true;
let emptyPrecisionMatchRadioButtons = true;
let boolMatchByVIN = false;
let selectedOptionHasAvailableStock = false;
let failedVinDecode = false;
let vinDecoderJustUsed = false;
let storedVin = '';
let storedDecodedVin = '';
let autoSelectedColor = '';
let selectedProductSku = '';
let amountOfVINPostMessages = 0;
let amountOfOOSPaintVariants = 0;
let currentAddToCartBtnLibrary;
if (addToCartButtonLibrary) {
    currentAddToCartBtnLibrary = addToCartButtonLibrary;
}
if (addToCartForUnpaintedLibrary) {
    currentAddToCartBtnLibrary = addToCartForUnpaintedLibrary;
}




/*******************************************************************************************************
**                                                                                                    **
**                                             ENABLE/DISABLE                                         **
**                                                                                                    **
*******************************************************************************************************/


// DISABLING AND CLEARING
function disableQualityTypeButtons() {
    if (qualityTypeButtonsLibrary) qualityTypeButtonsLibrary.classList.add("disabled");
}
function clearQualityTypeButtons() {
    if (qualityOptionsLibrary) {
        qualityOptionsLibrary.forEach(button => {
            button.classList.remove("selected");
        })
    };
}

function disableQualityDescriptionBtn() {
    if (qualityDescriptionBtnLibrary) qualityDescriptionBtnLibrary.disabled = true;
}

function disableVINTextboxForOEM() {
    if (vinTextBoxOEMLibrary) vinTextBoxOEMLibrary.disabled = true;
}

function disableCombinedVariantSelect() {
    if (combinedVariantSelectLibrary) combinedVariantSelectLibrary.disabled = true;
}
function clearCombinedVariantSelect() {
    if (combinedVariantSelectLibrary) combinedVariantSelectLibrary.selectedIndex = 0;
}

function disablePaintOptionRadioBtns() {
    if (!paintOptionsButtonsLibrary.classList.contains("disabled")) {
        paintOptionsButtonsLibrary.classList.add("disabled");
    }
    if (paintCodeWrapperLibrary && paintCodeWrapperLibrary.classList.contains('show')) {
        paintCodeWrapperLibrary.classList.remove('show');
    }
    if (paintCodeAppContainerLibrary && paintCodeAppContainerLibrary.classList.contains('show')) {
        paintCodeAppContainerLibrary.classList.remove('show');
    }
}

function clearPaintOptionRadioBtns() {
    if (paintOptionsIndividualButtonsLibrary) {
        paintOptionsIndividualButtonsLibrary.forEach(button => {
            button.classList.remove("selected");
        })
    };
}

function hideGetPaintCodeUsingVINCheckbox() {
    if (checkboxGetPaintCodeWithVINAndLabel) checkboxGetPaintCodeWithVINAndLabel.style.display = "none";
}

function hidePaintedStockKeyDisclaimer() {
    if (paintedStockKeyLibrary) paintedStockKeyLibrary.style.display = "none";
}

function disablehowToFindPaintCodeBtn() {
    if (paintOptionsButtonsLibrary) {
        disablePaintOptionRadioBtns();
        if (howToFindPaintCodeBtnLibrary) howToFindPaintCodeBtnLibrary.disabled = true;
    }
}

function disableGetPaintCodeUsingVin() {
    if (getPaintCodeUsingVinLibrary) getPaintCodeUsingVinLibrary.disabled = true;
}

function disableSelectVinVariantBtn() {
    if (selectVinVariantButtonLibrary) selectVinVariantButtonLibrary.disabled = true;
}

function disablePrecisionMatchBtns() {
    if (precisionMatchContainerLibrary) precisionMatchCheckboxYes.disabled = true;
    if (precisionMatchContainerLibrary) precisionMatchCheckboxNo.disabled = true;
    if (precisionMatchButton) precisionMatchButton.disabled = true;
}

function clearPrecisionMatchRadioButtons() {
    if (precisionMatchContainerLibrary) {
        const radios = document.querySelectorAll(`input[name="precision_match"]`);
        radios.forEach(radio => radio.checked = false);
        precisionMatchVinWrapper.classList.remove('show');
        precisionMatchInputBox.value = '';
        emptyPrecisionMatchRadioButtons = true;
    }
}

function disableVinVerificationBtns() {
    if (vinVerifyCheckbboxYesLibrary) vinVerifyCheckbboxYesLibrary.disabled = true;
    if (vinVerifyCheckboxNoLibrary) vinVerifyCheckboxNoLibrary.disabled = true;
    if (vinVerificationButtonLibrary) vinVerificationButtonLibrary.disabled = true;
}

function clearVinVerificationRadioButtons() {
    if (vinVerificationCheckboxGroupLibrary) {
        const radios = document.querySelectorAll(`input[name="fitment_guarantee"]`);
        radios.forEach(radio => radio.checked = false);
        vinVerificationWrapper.classList.remove('show');
        vinVerificationInput.value = '';
        emptyVinVerificationRadioButtons = true;
    }
}

function disableAddToCartButton() {
    if (currentAddToCartBtnLibrary) currentAddToCartBtnLibrary.disabled = true;
}




// ENABLING
function enableQualityTypeButtons() {
    if (qualityTypeButtonsLibrary) qualityTypeButtonsLibrary.classList.remove("disabled");
}

function enableQualityDescriptionBtn() {
    if (qualityDescriptionBtnLibrary) qualityDescriptionBtnLibrary.disabled = false;
}

function enableVINTextboxForOEM() {
    if (vinTextBoxOEMLibrary) vinTextBoxOEMLibrary.disabled = false;
}

function enableCombinedVariantSelect() {
    if (combinedVariantSelectLibrary) combinedVariantSelectLibrary.disabled = false;
}

function enablePaintOptionRadioBtns() {
    if (paintOptionsButtonsLibrary) paintOptionsButtonsLibrary.classList.remove("disabled");
}

function showGetPaintCodeUsingVINCheckbox() {
    if (checkboxGetPaintCodeWithVINAndLabel) checkboxGetPaintCodeWithVINAndLabel.style.display = "block";
}

function showPaintedStockKeyDisclaimer() {
    if (paintedStockKeyLibrary) paintedStockKeyLibrary.style.display = "block";
}

function enablehowToFindPaintCodeBtn() {
    enablePaintOptionRadioBtns();
    if (howToFindPaintCodeBtnLibrary) howToFindPaintCodeBtnLibrary.disabled = false;
}

function enableGetPaintCodeUsingVin() {
    if (getPaintCodeUsingVinLibrary) getPaintCodeUsingVinLibrary.disabled = false;
}

function enableSelectVinVariantBtn() {
    if (selectVinVariantButtonLibrary) selectVinVariantButtonLibrary.disabled = false;
}

function enablePrecisionMatchBtns() {
    if (precisionMatchContainerLibrary) precisionMatchCheckboxYes.disabled = false;
    if (precisionMatchContainerLibrary) precisionMatchCheckboxNo.disabled = false;
    if (precisionMatchButton) precisionMatchButton.disabled = false;
}

function enableVinVerificationBtns() {
    if (vinVerifyCheckbboxYesLibrary) vinVerifyCheckbboxYesLibrary.disabled = false;
    if (vinVerifyCheckboxNoLibrary) vinVerifyCheckboxNoLibrary.disabled = false;
    if (vinVerificationButtonLibrary) vinVerificationButtonLibrary.disabled = false;
}

function enableAddToCartButton() {
    if (currentAddToCartBtnLibrary) currentAddToCartBtnLibrary.disabled = false;
}




/*******************************************************************************************************
**                                                                                                    **
**                                             CAPA-OEM-options                                       **
**                                                                                                    **
*******************************************************************************************************/


function addOEMBadge() {
    const capaImg = document.getElementById('capa-certified-badge');
    if (capaImg) capaImg.remove();

    const existingOEMBadge = document.getElementById('oem-badge');
    if (existingOEMBadge) return;

    const oemImg = document.createElement('img');
    oemImg.src = 'https://cdn.shopify.com/s/files/1/0248/6291/6693/files/OEM_Badge.png';
    oemImg.alt = 'OEM Certified';
    oemImg.id = 'oem-badge';
    oemImg.style.position = 'relative';
    oemImg.style.height = "34px";
    oemImg.style.margin = "0 0 0 10px";

    if (window.innerWidth > 720) {
        priceContainerLargeScreen.appendChild(oemImg);
    } else {
        priceContainerSmallScreen.appendChild(oemImg);
    }
}

function togglePaintedStockKey(selectedType, hasAvailableOptions) {
    if (!paintedStockKeyLibrary) return false;

    if (hasAvailableOptions[selectedType]) {
        selectedOptionHasAvailableStock = true;
    } else {
        selectedOptionHasAvailableStock = false;
    };
}

function updatePriceDisplay(selectedType) {
    const selectedButton = document.querySelector(`.quality-option[data-value="${selectedType}"]`);
    if (!selectedButton) return;

    // Option 1: If the button text includes the price
    const buttonText = selectedButton.textContent;
    const priceMatch = buttonText.match(/\$[\d,]+\.\d{2}/);
    if (!priceMatch) return;

    priceDisplay.textContent = priceMatch[0];
    priceDisplaySmallScreen.textContent = priceMatch[0];
}




/*******************************************************************************************************
**                                                                                                    **
**                                             UTILITIES                                              **
**                                                                                                    **
*******************************************************************************************************/


function hideShopifyChat() {
    const shopifyChat = document.getElementById('shopify-chat');
    if (shopifyChat) {
        shopifyChat.style.display = 'none';
    }
}

function showShopifyChat() {
    const shopifyChat = document.getElementById('shopify-chat');
    if (shopifyChat) {
        shopifyChat.style.display = 'block';
    }
}

function resortToGetPaintCodeByVin(eventVin, eventMatchByVIN) {
    //Have to get the most up-to-date combined variants
    const combinedVariantSelect = document.getElementById('variant-selector');
    const vin = eventVin;
    let hiddenDiv;
    storedDecodedVin = vin;

    if (amountOfVINPostMessages > 0 && eventMatchByVIN === false) {
        return;
    }

    // If boolMatchByVIN is true, then it has already been set in the case that a paint code has been returned for the vin decoder but a matching
    // option has not been found for it
    if (boolMatchByVIN === false) {
        boolMatchByVIN = eventMatchByVIN;
    }

    if (document.querySelector('.hidden-vin-option')) {
        hiddenDiv = document.querySelector('.hidden-vin-option');
    } else if (document.querySelector('.hidden-vin-option-single-quality')) {
        hiddenDiv = document.querySelector('.hidden-vin-option-single-quality');
    }

    // Only display the option to select Match Paint by VIN in certain circumstances
    if (boolMatchByVIN) {
        if (hiddenDiv) {
            if (!combinedVariantSelect) {
                console.error("Error: Select element not found.");
                return;
            }

            let value;
            if (hiddenDiv.getAttribute("data-value")) {
                value = hiddenDiv.getAttribute("data-value");
            } else if (hiddenDiv.getAttribute("value")) {
                value = hiddenDiv.getAttribute("value");
            }

            const text = hiddenDiv.textContent;
            const price = hiddenDiv.getAttribute("data-price") || "";
            const priceDifference = hiddenDiv.getAttribute("data-price-difference") || "";
            const color = hiddenDiv.getAttribute("data-color") || "";
            const variantTitle = hiddenDiv.getAttribute("data-variant-title") || "";
            const productTitle = hiddenDiv.getAttribute("data-product-title") || "";
            const variantSKU = hiddenDiv.getAttribute("data-variant-sku") || "";
            const option = document.createElement("option");

            option.value = value;
            option.textContent = text;
            option.setAttribute("data-price", price);
            option.setAttribute("data-price-difference", priceDifference);
            option.setAttribute("data-color", color);
            option.setAttribute("data-variant-title", variantTitle);
            option.setAttribute("data-product-title", productTitle);
            option.setAttribute("data-variant-sku", variantSKU);

            option.classList.add("hidden-vin-option");

            // Append and remove
            combinedVariantSelect.appendChild(option);
            hiddenDiv.remove();
        }
    }
    amountOfVINPostMessages++;
}

