/*******************************************************************************************************
**                                                                                                    **
**                                             VARIABLES                                              **
**                                                                                                    **
*******************************************************************************************************/


const addToCartButtonLibrary = document.querySelector('.add-to-cart');
const addToCartForUnpaintedLibrary = document.querySelector('.add-to-cart-for-unpainted');
const addToCartStickyLibrary = document.querySelector('.sticky-add-to-cart');
const checkboxGetPaintCodeWithVINAndLabel = document.querySelector('input#checkbox-get-paint-code-with-vin')?.closest('label');
const colorPreviewContainerLibrary = document.querySelector('.color-preview-container-for-customizations');
const combinedVariantSelectLibrary = document.getElementById('variant-selector');
const form = document.getElementById('product-form');
const getPaintCodeUsingVinLibrary = document.querySelector('.get-paint-code-using-vin');
const howToFindPaintCodeBtnLibrary = document.getElementById('how-to-find-your-paint-code-vindecoder');
const notCompatibleMsgLibrary = document.querySelector('.not-compatible-msg');
const oemVinContainerLibrary = document.querySelector('.oem-vin-container');
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
const productPartDescriptionLibrary = document.querySelector('.product-description-collapsible-text');
const qualityTypeSelectLibrary = document.getElementById('quality-type-select');
const qualityOptionsCheckboxLibrary = document.querySelectorAll('.quality-options-checkbox');
const qualityDescriptionBtnLibrary = document.getElementById('quality-description-vindecoder');
const selectVinVariantButtonLibrary = document.getElementById('select-vin-variant');
const titleElementLibrary = document.querySelector('.product-title');
const vinInputLibrary = document.querySelector('#vin-textbox');
const vinTextBoxOEMLibrary = document.getElementById('vin-textbox-for-oem');
const vinTextboxContainer = document.getElementById("vin-textbox-container");
const vinVerificationCheckboxGroupLibrary = document.querySelector('.vin-verification-checkbox-group');
const vinVerifyCheckbboxYesLibrary = document.getElementById('fitment-yes');
const vinVerifyCheckboxNoLibrary = document.getElementById('fitment-no');
const vinVerificationButtonLibrary = document.getElementById('vin-verification-button');
const vinVerificationWrapper = document.getElementById('vin-textbox-for-verification-wrapper show');
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
let matchingByVin = false;
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
let productVariants = {};
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
// Toggling

// DISABLING AND CLEARING
function hideFitmentFailButton() {

    // Must defined the element here as it is dynamically created 
    const fitmentFailButtonLibrary = document.getElementById('fitment-fail-button');

    if (fitmentFailButtonLibrary) fitmentFailButtonLibrary.style.display = "none";
}

function clearQualityTypeSelect() {
    if (qualityOptionsCheckboxLibrary) {
        const qualityRadioButtons = document.querySelectorAll('input[name="quality_type"]');
        qualityRadioButtons.forEach(radio => radio.checked = false);
    } else {
        if (qualityTypeSelectLibrary) qualityTypeSelectLibrary.selectedIndex = 0;
    }
}

function disablePrePaintedMessagingQualityLevel() {
    if (paintedStockKeyQualityLevelLibrary) {
        paintedStockKeyQualityLevelLibrary.classList.add("disabled")
    }
}

function disableTurboSelect() {
    const turboRadioButtons = document.querySelectorAll('.turbo-radio');
    turboRadioButtons.forEach(radio => {
        radio.disabled = true;
        radio.checked = false;
    });
    document.querySelectorAll('.turboText').forEach(function (el) {
        el.classList.add('turbo-disabled');
    });
    document.querySelectorAll('.turbo-type-select').forEach(function (el) {
        el.classList.add('turbo-disabled');
    });
    document.querySelector('.turboRedirectButton').style.display = 'none';
    document.querySelector('.additional-options-title').classList.add('additional-options-title-disabled');
}

function hideNotCompatibleMsg() {
    if (notCompatibleMsgLibrary) notCompatibleMsgLibrary.style.display = "none";
}

function disableQualityTypeSelect() {
    if (qualityOptionsCheckboxLibrary) {
        const qualityRadioButtons = document.querySelectorAll('input[name="quality_type"]');

        // If quality options checkboxes
        qualityRadioButtons.forEach(radio => {
            radio.disabled = true;
        });
    }

    // If quality select dropdown
    clearQualityTypeSelect();
    if (qualityTypeSelectLibrary) qualityTypeSelectLibrary.disabled = true;
}

function disableQualityDescriptionBtn() {
    if (qualityDescriptionBtnLibrary) qualityDescriptionBtnLibrary.disabled = true;
}

function disableVINTextboxForOEM() {
    if (vinTextBoxOEMLibrary) vinTextBoxOEMLibrary.disabled = true;
}

function hideVINTextboxForOEM() {
    if (oemVinContainerLibrary && oemVinContainerLibrary.classList.contains("show")) oemVinContainerLibrary.classList.remove("show");
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

function hideColorPreviewContainer() {
    if (colorPreviewContainerLibrary && colorPreviewContainerLibrary.classList.contains('show')) colorPreviewContainerLibrary.classList.remove("show");
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
    if (vinVerificationInput) vinVerificationInput.disabled = true;
}

function clearVinVerificationRadioButtons() {
    if (vinVerificationCheckboxGroupLibrary) {
        const radios = document.querySelectorAll(`input[name="fitment_guarantee"]`);
        radios.forEach(radio => radio.checked = false);
        vinVerificationWrapper.classList.remove('show');
        // vinVerificationInput.value = '';
        emptyVinVerificationRadioButtons = true;
    }
}

function hideOOSPaintVariantsMsg() {
    const oosPaintVariantsLibrary = document.querySelector('.oos-paint-variants');
    if (oosPaintVariantsLibrary && oosPaintVariantsLibrary.classList.contains('show')) oosPaintVariantsLibrary.classList.remove("show");
}

function clearOOSPaintCheckbox() {
    const checkbox = document.querySelector(`input[name="acknowledge_difficult_paint"]`);
    if (checkbox.checked === true) checkbox.checked = false;
}

function hideVinVerificationTextbox() {
    if (vinVerificationWrapper && vinVerificationWrapper.classList.contains('show')) vinVerificationWrapper.classList.remove('show');
}

function hideAddToCartButton() {
    if (currentAddToCartBtnLibrary) currentAddToCartBtnLibrary.style.display = 'none';
}

function disableAddToCartButton() {
    if (currentAddToCartBtnLibrary) currentAddToCartBtnLibrary.disabled = true;
    if (addToCartStickyLibrary) addToCartStickyLibrary.disabled = true;
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
    if (qualityOptionsCheckboxLibrary) {
        const qualityRadioButtons = document.querySelectorAll('input[name="quality_type"]');

        // If quality options checkboxes
        qualityRadioButtons.forEach(radio => {
            if (radio.dataset.available === "true") {
                radio.disabled = false;
            }
        });
    }
    if (qualityTypeSelectLibrary) qualityTypeSelectLibrary.disabled = false;
}

function enableTurboSelect() {
    console.log("Enabling turbo select");
    const turboRadioButtons = document.querySelectorAll('.turbo-radio');
    turboRadioButtons.forEach(radio => {
        radio.disabled = false;
    });
    document.querySelectorAll('.turboText').forEach(function (el) {
        el.classList.remove('turbo-disabled');
    });
    document.querySelectorAll('.turbo-type-select').forEach(function (el) {
        el.classList.remove('turbo-disabled');
    });
    document.querySelector('.additional-options-title').classList.remove('additional-options-title-disabled');
}

function showNotCompatibleMsg() {
    if (notCompatibleMsgLibrary) notCompatibleMsgLibrary.style.display = "block";
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

function showColorPreviewContainer() {
    if (colorPreviewContainerLibrary && !colorPreviewContainerLibrary.classList.contains('show')) colorPreviewContainerLibrary.classList.add("show");
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
    if (!finalVinVerificationSubmissionVin) {
        if (vinVerificationInput) vinVerificationInput.disabled = false;
    }
}

function showOOSPaintVariantsMsg() {
    const oosPaintVariantsLibrary = document.querySelector('.oos-paint-variants');
    if (oosPaintVariantsLibrary && !oosPaintVariantsLibrary.classList.contains('show')) oosPaintVariantsLibrary.classList.add("show");
    // if the add to cart btn is enabled, disable it
    if (currentAddToCartBtnLibrary && !currentAddToCartBtnLibrary.disabled) {
        currentAddToCartBtnLibrary.disabled = true;
    }
}

function showVinVerificationTextbox() {
    if (vinVerificationWrapper) vinVerificationWrapper.classList.add('show');
}

function showAddToCartButton() {
    if (currentAddToCartBtnLibrary) currentAddToCartBtnLibrary.style.display = 'block';
}

function enableAddToCartButton() {
    if (currentAddToCartBtnLibrary) currentAddToCartBtnLibrary.disabled = false;
    if (addToCartStickyLibrary) addToCartStickyLibrary.disabled = false;
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

async function populateVariantDropdown(selectedType, disabledFirstOptionTranslation) {
    const combinedVariantSelect = document.getElementById('variant-selector');
    if (combinedVariantSelect) {
        combinedVariantSelect.innerHTML = `<option value="" disabled selected>${disabledFirstOptionTranslation}</option>`;
    }

    if (combinedVariantSelect) {
        clearCombinedVariantSelect(); // Reset to first option (Select Paint Code)
        disableAddToCartButton();
    }

    // Get the relevant variants for selected product type
    let variants = productVariants[selectedType] || [];

    if (variants.length === 0) {
        if (productVariants.single) {
            // If no variants for the selected type, use the single variant
            variants = productVariants.single;
        } else {
            variants = productVariants.current;
        }
    }

    const variantsUpdateEvent = new CustomEvent('variantsUpdated', { detail: { variants } });
    document.dispatchEvent(variantsUpdateEvent);

    if (variants.length > 0) {
        if (combinedVariantSelect) {
            enableCombinedVariantSelect();
            updateProgressHeaderColors();
        }
        enablehowToFindPaintCodeBtn();
        enableGetPaintCodeUsingVin();
        enableSelectVinVariantBtn();

        variants.forEach(function (variant) {
            let isVariantAvailable = true;

            // set it to true in the following because it is actually checking to see if the variant is hidden
            if (variant.variantAvailable === "true" || variant.variantAvailable === true) {
                isVariantAvailable = false;
            } else {
                isVariantAvailable = true;
            }

            window.selectedVariantId = variant.id;
            let option;

            // Compose base label
            let optionLabel = `${variant.title}`;

            // If it has extra inventory, append the tag to the text
            if (window.enablePrepaintedMessaging) {
                if (variant.hasExtraInventory && isVariantAvailable) {
                    optionLabel += " 🚚";
                }
            }


            if (boolMatchByVIN === false) {
                // Check if the variant is "Match Paint by VIN"
                if (variant.title.trim().startsWith("Match Paint by VIN") || variant.title.trim().startsWith("Pintura de combinación por VIN")) {
                    // Create a div instead of an option
                    const div = document.createElement("div");
                    div.classList.add("hidden-vin-option");

                    // Copy attributes to div
                    div.setAttribute("data-price", variant.price || "");
                    div.setAttribute("data-price-difference", variant.priceDifference || "");
                    div.setAttribute("data-color", variant.color || "");
                    div.setAttribute("data-variant-title", variant.variantTitle || "");
                    div.setAttribute("data-product-title", variant.productTitle || "");
                    div.setAttribute("data-variant-sku", variant.variantSku || "");

                    // Set text content
                    div.dataset.value = variant.id || "";
                    div.textContent = variant.title;
                    div.style.display = "none";

                    // Append div after select
                    combinedVariantSelect.insertAdjacentElement("afterend", div);
                    return;
                } else {
                    // Create an option normally
                    option = document.createElement("option");
                    option.value = variant.id;

                    if (!isVariantAvailable) {
                        amountOfOOSPaintVariants++;
                        option.dataset.unavailable = "true";
                    } else {
                        option.dataset.unavailable = "false";
                    }

                    option.textContent = optionLabel;
                    option.dataset.price = variant.price;
                    option.dataset.color = variant.color;
                    option.dataset.variantTitle = variant.variantTitle;
                    option.dataset.priceDifference = variant.priceDifference;
                    option.dataset.productTitle = variant.productTitle;
                    option.dataset.variantSku = variant.variantSku;
                }
            } else {
                option = document.createElement('option');
                option.value = variant.id;

                if (!isVariantAvailable) {
                    amountOfOOSPaintVariants++;
                    option.dataset.unavailable = "true";
                } else {
                    option.dataset.unavailable = "false";
                }

                option.textContent = optionLabel;
                option.dataset.price = variant.price;
                option.dataset.color = variant.color;
                option.dataset.priceDifference = variant.priceDifference;
                option.dataset.productTitle = variant.productTitle;
                option.dataset.variantSku = variant.variantSku;
            }

            if (failedVinDecode === true) {
                option.style.display = "block";
            }

            let currentProductTitle = variant.productTitle || "";
            if (currentProductTitle.length === 0) {
                currentProductTitle = variant.name;
            }

            if (currentProductTitle.length > 0) {
                const productTitle = decodeHtmlEntities(variant.productTitle);
                if (selectedType !== "oem") {
                    titleElementLibrary.textContent = productTitle;
                }
                if (productTitle.includes("CAPA")) {
                    const oemImg = document.getElementById('oem-badge');
                    if (oemImg) {
                        oemImg.remove();
                    }
                    const capaImgId = document.getElementById('capa-certified-badge');
                    if (!capaImgId) {
                        const capaImg = document.createElement('img');
                        capaImg.src = 'https://cdn.shopify.com/s/files/1/0248/6291/6693/files/Capa_Certified_Icon_26a22ba1-e72d-4724-a44d-e73fbf1f0d2d.png';
                        capaImg.alt = 'CAPA Certified';
                        capaImg.id = 'capa-certified-badge';

                        capaImg.style.position = 'relative';
                        capaImg.style.height = "34px";
                        capaImg.style.margin = "0 0 0 10px";

                        if (window.innerWidth > 720) {
                            priceContainerLargeScreen.appendChild(capaImg);
                        } else {
                            priceContainerSmallScreen.appendChild(capaImg);
                        }

                    }
                } else {
                    if (!productTitle.includes("OEM")) {
                        const capaImg = document.getElementById('capa-certified-badge');
                        if (capaImg) {
                            capaImg.remove();
                        }
                        const oemImg = document.getElementById('oem-badge');
                        if (oemImg) {
                            oemImg.remove();
                        }
                    }
                }
            }

            // Optionally add class to selected item or add tooltip
            if (variant.hasExtraInventory) {
                option.dataset.status = "ready-to-ship";
                option.title = "Ready to ship"; // Tooltip when hovering
            }
            const tempElement = document.createElement('div');
            tempElement.innerHTML = variant.productDescription;
            if (productPartDescriptionLibrary) {
                productPartDescriptionLibrary.innerHTML = tempElement.innerHTML;
            }
            if (combinedVariantSelect) {
                combinedVariantSelect.appendChild(option);
            }
        });
    } else {
        if (combinedVariantSelect) {
            disableCombinedVariantSelect();
            clearCombinedVariantSelect();
            disableAddToCartButton();
            updateProgressHeaderColors();
        }
        disablehowToFindPaintCodeBtn();
        disableGetPaintCodeUsingVin();
        disableSelectVinVariantBtn();
    }
}

function decodeHtmlEntities(text) {
    const tempElement = document.createElement('textarea');
    tempElement.innerHTML = text;
    return tempElement.value;
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

    if (vinTextBoxOEMLibrary && vinTextBoxOEMLibrary.value.length) {
        vinTextBoxOEMLibrary.value = "";
        hideVINTextboxForOEM();
    }

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

function calculatePrice(inputElement) {
    let price;

    if (inputElement.tagName === 'SELECT') {
        const selectedOption = inputElement.options[inputElement.selectedIndex];
        price = selectedOption.getAttribute('data-price');
    } else if (inputElement.type === 'radio') {
        // Find the checked radio in the group
        const checkedRadio = document.querySelector('input[name="quality_type"]:checked');
        if (!checkedRadio) return;
        price = checkedRadio.getAttribute('data-price');
    } else {
        console.warn('Unsupported element passed to calculatePrice:', inputElement);
        return;
    }

    if (!price) return;

    if (price.trim().startsWith('$')) {
        document.getElementById('price-display').innerText = price;
        document.getElementById('price-display-small-screen').innerText = price;
        document.getElementById('price-display-sticky').innerText = price;
        document.getElementById('price-display-a2c').innerText = price;
        return;
    }

    const formattedPrice = formatPriceToUSD(price);

    document.getElementById('price-display').innerText = formattedPrice;
    document.getElementById('price-display-small-screen').innerText = formattedPrice;
    document.getElementById('price-display-sticky').innerText = formattedPrice;
    document.getElementById('price-display-a2c').innerText = formattedPrice;
}

function formatPriceToUSD(price) {
    if (!price) return;

    if (price.trim().startsWith('$')) {
        return price;
    }
    const formattedPrice = (price / 100).toFixed(2);
    return '$' + formattedPrice;
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