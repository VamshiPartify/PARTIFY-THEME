/*******************************************************************************************************
**                                                                                                    **
**                                             VARIABLES                                              **
**                                                                                                    **
*******************************************************************************************************/


const addToCartButtonLibrary = document.querySelector('.add-to-cart');
const addToCartForUnpaintedLibrary = document.querySelector('.add-to-cart-for-unpainted');
const checkboxGetPaintCodeWithVINAndLabel = document.querySelector('input#checkbox-get-paint-code-with-vin')?.closest('label');
const combinedVariantSelectLibrary = document.getElementById('variant-selector');
const form = document.getElementById('product-form');
const getPaintCodeUsingVinLibrary = document.querySelector('.get-paint-code-using-vin');
const howToFindPaintCodeBtnLibrary = document.getElementById('how-to-find-your-paint-code-vindecoder');
const oemVinContainerLibrary = document.querySelector('.oem-vin-container');
const oosPaintVariantsLibrary = document.querySelector('.oos-paint-variants');
const paintedStockKeyPaintLevelLibrary = document.querySelector('.painted-stock-key-paint-level');
const paintedStockKeyQualityLevelLibrary = document.querySelector('.painted-stock-key-quality-level');
const paintCodeAppContainerLibrary = document.getElementById('paintcode-app-container');
const paintCodeWrapperLibrary = document.querySelector(".paint-code-wrapper");
const paintOptionCheckboxByPaintCode = document.getElementById('checkbox-select-paint-option');
const paintOptionCheckboxByUnpainted = document.getElementById('checkbox-select-unpainted');
const paintOptionCheckboxByVIN = document.getElementById('checkbox-get-paint-code-with-vin');
const paintOptionsCheckboxGroupLibrary = document.querySelector('.paint-options-checkbox-group');
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
const qualityTypeSelectLibrary = document.getElementById('quality-type-select');
const qualityDescriptionBtnLibrary = document.getElementById('quality-description-vindecoder');
const selectVinVariantButtonLibrary = document.getElementById('select-vin-variant');
const vinInputLibrary = document.querySelector('#vin-textbox');
const vinTextBoxOEMLibrary = document.getElementById('vin-textbox-for-oem');
const vinTextboxContainer = document.getElementById("vin-textbox-container");
const vinVerificationCheckboxGroupLibrary = document.querySelector('.vin-verification-checkbox-group');
const vinVerifyCheckbboxYesLibrary = document.getElementById('fitment-yes');
const vinVerifyCheckboxNoLibrary = document.getElementById('fitment-no');
const vinVerificationButtonLibrary = document.getElementById('vin-verification-button');
const vinVerificationWrapper = document.getElementById('vin-textbox-for-verification-wrapper');
const vinVerificationInput = document.getElementById('vin-textbox-for-verification');

let emptyVinVerificationRadioButtons = true;
let emptyPrecisionMatchRadioButtons = true;
let boolMatchByVIN = false;
let selectedOptionHasAvailableStock = false;
let failedVinDecode = false;
let vinDecoderJustUsed = false;
let decodedVINHasAvailableStock = false;
let addedBadgeInPaintOptions = false;
let selectedVariantUnavailable = false;
let autoSelectedBanned = false;
let aftermarketAvailability = '';
let capaAvailability = '';
let oemAvailability = '';
let storedVin = '';
let storedDecodedVin = '';
let autoSelectedColor = '';
let autoSelectedOption = '';
let selectedProductSku = '';
let selectedProductColor = '';
let selectedProductTitle = '';
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
function hideFitmentFailButton() {

    // Must defined the element here as it is dynamically created 
    const fitmentFailButtonLibrary = document.getElementById('fitment-fail-button');

    if (fitmentFailButtonLibrary) fitmentFailButtonLibrary.style.display = "none";
}

function clearQualityTypeSelect() {
    if (qualityTypeSelectLibrary) qualityTypeSelectLibrary.selectedIndex = 0;
}

function disablePrePaintedMessagingQualityLevel() {
    if (paintedStockKeyQualityLevelLibrary) {
        paintedStockKeyQualityLevelLibrary.classList.add("disabled")
    }
}

function disableQualityTypeSelect() {
    clearQualityTypeSelect();
    if (qualityTypeSelectLibrary) qualityTypeSelectLibrary.disabled = true;
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
    if (paintOptionCheckboxByUnpainted) paintOptionCheckboxByUnpainted.disabled = true;
    if (paintOptionCheckboxByPaintCode) {
        paintOptionCheckboxByPaintCode.disabled = true;
        if (paintCodeWrapperLibrary && paintCodeWrapperLibrary.classList.contains('show')) {
            paintCodeWrapperLibrary.classList.remove('show');
        }
        if (paintCodeAppContainerLibrary && paintCodeAppContainerLibrary.classList.contains('show')) {
            paintCodeAppContainerLibrary.classList.remove('show');
        }
    }
    if (paintOptionCheckboxByVIN) paintOptionCheckboxByVIN.disabled = true;
}

function clearPaintOptionRadioBtns() {
    if (paintOptionsCheckboxGroupLibrary) {
        const radios = document.querySelectorAll(`input[name="select_paint_option"]`);
        radios.forEach(radio => radio.checked = false);
    }
}

function hideGetPaintCodeUsingVINCheckbox() {
    if (checkboxGetPaintCodeWithVINAndLabel) checkboxGetPaintCodeWithVINAndLabel.style.display = "none";
}

function hidePaintedStockKeyPaintDisclaimer() {
    if (paintedStockKeyPaintLevelLibrary) paintedStockKeyPaintLevelLibrary.style.display = "none";
}

function hidePaintedStockKeyQualityDisclaimer() {
    if (paintedStockKeyQualityLevelLibrary) paintedStockKeyQualityLevelLibrary.style.display = "none";
}

function disablePaintedStockKeyQualityDisclaimer() {
    if (paintedStockKeyQualityLevelLibrary) paintedStockKeyQualityLevelLibrary.classList.add("disabled");
}

function hideVinMessageParagraph() {
    const vinMessageParagraphLibrary = document.querySelector('.vin-decoder-message');

    if (
        vinMessageParagraphLibrary &&
        (vinMessageParagraphLibrary.innerHTML.includes("will be attached to this order and") ||
            vinMessageParagraphLibrary.innerHTML.includes("se adjuntará a esta orden"))
    ) {
        vinMessageParagraphLibrary.style.display = 'none';
    }
}

function disablehowToFindPaintCodeBtn() {
    disablePaintOptionRadioBtns();
    if (howToFindPaintCodeBtnLibrary) howToFindPaintCodeBtnLibrary.disabled = true;
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

function hideOOSPaintVariantsMsg() {
    if (oosPaintVariantsLibrary && oosPaintVariantsLibrary.classList.contains('show')) oosPaintVariantsLibrary.classList.remove("show");
}

function hideAddToCartButton() {
    if (currentAddToCartBtnLibrary) currentAddToCartBtnLibrary.style.display = 'none';
}

function disableAddToCartButton() {
    if (currentAddToCartBtnLibrary) currentAddToCartBtnLibrary.disabled = true;
}




// ENABLING
function showFitmentFailButton() {

    // Must defined the element here as it is dynamically created 
    const fitmentFailButtonLibrary = document.getElementById('fitment-fail-button');

    if (fitmentFailButtonLibrary) fitmentFailButtonLibrary.style.display = "block";
}

function enablePrePaintedMessagingQualityLevel() {
    if (paintedStockKeyQualityLevelLibrary) {
        paintedStockKeyQualityLevelLibrary.classList.remove("disabled")
    }
}

function enableProductTypeSelect() {
    if (qualityTypeSelectLibrary) qualityTypeSelectLibrary.disabled = false;
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
    if (paintOptionCheckboxByUnpainted) paintOptionCheckboxByUnpainted.disabled = false;
    if (paintOptionCheckboxByPaintCode) paintOptionCheckboxByPaintCode.disabled = false;
    if (paintOptionCheckboxByVIN) paintOptionCheckboxByVIN.disabled = false;
}

function showGetPaintCodeUsingVINCheckbox() {
    if (checkboxGetPaintCodeWithVINAndLabel) checkboxGetPaintCodeWithVINAndLabel.style.display = "block";
}

function showPaintedStockKeyPaintDisclaimer() {
    if (paintedStockKeyPaintLevelLibrary) paintedStockKeyPaintLevelLibrary.style.display = "block";
}

function showPaintedStockKeyQualityDisclaimer(message) {
    if (paintedStockKeyQualityLevelLibrary) {
        paintedStockKeyQualityLevelLibrary.style.display = "block";
        paintedStockKeyQualityLevelLibrary.innerHTML = message;
    }
}

function enablePaintedStockKeyQualityDisclaimer() {
    if (paintedStockKeyQualityLevelLibrary) paintedStockKeyQualityLevelLibrary.classList.remove("disabled");
}

function showVinMessageParagraph() {
    const vinMessageParagraphLibrary = document.querySelector('.vin-decoder-message');

    if (
        vinMessageParagraphLibrary &&
        (vinMessageParagraphLibrary.innerHTML.includes("will be attached to this order and") ||
            vinMessageParagraphLibrary.innerHTML.includes("se adjuntará a esta orden"))
    ) {
        vinMessageParagraphLibrary.style.display = 'block';
    }
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

function showOOSPaintVariantsMsg() {
    if (oosPaintVariantsLibrary && !oosPaintVariantsLibrary.classList.contains('show')) oosPaintVariantsLibrary.classList.add("show");
}

function showAddToCartButton() {
    if (currentAddToCartBtnLibrary) currentAddToCartBtnLibrary.style.display = 'block';
}

function enableAddToCartButton() {
    if (currentAddToCartBtnLibrary) currentAddToCartBtnLibrary.disabled = false;
}


/*******************************************************************************************************
**                                                                                                    **
**                                       Quality Options                                              **
**                                                                                                    **
*******************************************************************************************************/


function handleQualityLevelPrePaintMsg(STOCK_POSTFIX, aftermarketWord, andWord) {

    // Displays the pre-painted in stock message at quality level
    if (window.enablePrepaintedMessaging) {
        if (aftermarketAvailability || capaAvailability || oemAvailability) {
            const options = [];

            if (aftermarketAvailability) options.push(`<strong>${aftermarketWord}</strong>`);
            if (capaAvailability) options.push('<strong>CAPA</strong>');
            if (oemAvailability) options.push('<strong>OEM</strong>');

            // Join the list properly with commas and "and"
            let optionsString = '';
            if (options.length === 1) {
                optionsString = options[0];
            } else if (options.length === 2) {
                optionsString = `${options[0]} ${andWord} ${options[1]}`;
            } else if (options.length === 3) {
                optionsString = `${options[0]}, ${options[1]}, ${andWord} ${options[2]}`;
            }

            const finalMessage = `${optionsString} ${STOCK_POSTFIX}`;
            showPaintedStockKeyQualityDisclaimer(finalMessage);
        }
    }
}

function addInStockBadgeInQualityOptions() {
    qualityOptionsLibrary.forEach(button => {
        const quality = button.getAttribute('data-value');
        const isInStock = handleCheckQualityAvailability(quality);

        if (isInStock) {
            // Create the new element
            const badge = createInStockBadge();

            // Insert before the .quality-option-labels element
            const labels = button.querySelector('.quality-option-labels');
            if (labels) {
                button.insertBefore(badge, labels);
            }
        }
    });
}

function addInStockBadgeInPaintOptions() {
    addedBadgeInPaintOptions = true;
    paintOptionsIndividualButtonsLibrary.forEach(button => {
        // Create the new element
        const badge = createInStockBadge();
        badge.classList.add("ready-paint");

        // Insert before the .quality-option-labels element
        const labels = button.querySelector('.paint-option-labels-wrapper');
        if (labels) {
            button.insertBefore(badge, labels);
        }
    });
}


/*******************************************************************************************************
**                                                                                                    **
**                                         Paint Options                                              **
**                                                                                                    **
*******************************************************************************************************/

function togglePaintedStockKey(selectedType, hasAvailableOptions) {
    if (!paintedStockKeyPaintLevelLibrary) return false;

    if (hasAvailableOptions[selectedType]) {
        selectedOptionHasAvailableStock = true;
    } else {
        selectedOptionHasAvailableStock = false;
    };
}

/*******************************************************************************************************
**                                                                                                    **
**                                         Vin Decoder App                                            **
**                                                                                                    **
*******************************************************************************************************/

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

/*******************************************************************************************************
**                                                                                                    **
**                                             UTILITIES                                              **
**                                                                                                    **
*******************************************************************************************************/

function createInStockBadge() {
    const badge = document.createElement('div');
    badge.classList.add('available-options');
    badge.textContent = '✓';
    return badge;
}

function hideInStockBadgeOnPaintOption() {
    if (document.querySelectorAll(".available-options")) {
        const readyBadges = document.querySelectorAll(".available-options.ready-paint");
        readyBadges.forEach(badge => {
            badge.style.display = "none";
        });
    }
}

function showInStockBadgeOnPaintOption() {
    if (document.querySelectorAll(".available-options")) {

        // Check for false prevents from calling the function more than once
        if (addedBadgeInPaintOptions === false) {
            // addInStockBadgeInPaintOptions();
        }
        const readyBadges = document.querySelectorAll(".available-options.ready-paint");
        readyBadges.forEach(badge => {
            badge.style.display = "block";
        });
    }
}

function handleCheckQualityAvailability(quality) {
    let isInStock = false;

    if (quality === 'aftermarket' && aftermarketAvailability) {
        isInStock = true;
    } else if (quality === 'capa' && capaAvailability) {
        isInStock = true;
    } else if (quality === 'oem' && oemAvailability) {
        isInStock = true;
    }
    return isInStock;
}

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

function updatePriceDisplay(selectedType) {
    const selectedText = qualityTypeSelectLibrary.options[qualityTypeSelectLibrary.selectedIndex].textContent;
    const priceMatch = selectedText.match(/\$[\d,]+\.\d{2}/);
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