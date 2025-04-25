const productTypeSelectLibrary = document.getElementById('product-type-select');
const qualityDescriptionBtnLibrary = document.getElementById('quality-description-vindecoder');
const oemVinContainerLibrary = document.querySelector('.oem-vin-container');
const combinedVariantSelectLibrary = document.getElementById('variant-selector');
const vinVerificationCheckboxGroupLibrary = document.querySelector('.vin-verification-checkbox-group');
const vinVerifyCheckbboxYesLibrary = document.getElementById('fitment-yes');
const vinVerifyCheckboxNoLibrary = document.getElementById('fitment-no');
const vinVerificationButtonLibrary = document.getElementById('vin-verification-button');
const addToCartButtonLibrary = document.getElementById('add-to-cart');
const addToCartForUnpaintedLibrary = document.getElementById('add-to-cart-for-unpainted');
const howToFindPaintCodeBtnLibrary = document.getElementById('how-to-find-your-paint-code-vindecoder');
const getPaintCodeUsingVinLibrary = document.querySelector('.get-paint-code-using-vin');
const selectVinVariantButtonLibrary = document.getElementById('select-vin-variant');
const priceContainerLargeScreen = document.querySelector('.price-container-large-screen');
const priceContainerSmallScreen = document.querySelector('.price-container');
const priceDisplay = document.getElementById('price-display');
const priceDisplaySmallScreen = document.getElementById('price-display-small-screen');
const vinInputWrapper = document.getElementById('vin-textbox-for-verification-wrapper');
const vinInput = document.getElementById('vin-textbox-for-verification');
const vinTextBoxOEM = document.getElementById('vin-textbox-for-oem');







let currentAddToCartBtnLibrary;
if(addToCartButtonLibrary) {
    currentAddToCartBtnLibrary = addToCartButtonLibrary;
}
if(addToCartForUnpaintedLibrary) {
    currentAddToCartBtnLibrary = addToCartForUnpaintedLibrary;
}



/*******************************************************************************************************
**                                                                                                    **
**                                             ENABLE/DISABLE                                         **
**                                                                                                    **
*******************************************************************************************************/


// DISABLING AND CLEARING
function disableProductTypeSelect() {
    if (productTypeSelectLibrary) productTypeSelectLibrary.disabled = true;
}
function clearProductTypeSelect() {
    if (productTypeSelectLibrary) productTypeSelectLibrary.selectedIndex = 0;
}

function disableQualityDescriptionBtn() {
    if (qualityDescriptionBtnLibrary) qualityDescriptionBtnLibrary.disabled = true;
}

function disableVINTextboxForOEM() {
    if (vinTextBoxOEM) vinTextBoxOEM.disabled = true;
}

function disableCombinedVariantSelect() {
    if (combinedVariantSelectLibrary) combinedVariantSelectLibrary.disabled = true;
}
function clearCombinedVariantSelect() {
    if (combinedVariantSelectLibrary) combinedVariantSelectLibrary.selectedIndex = 0;
}

function disablehowToFindPaintCodeBtn() {
    if (howToFindPaintCodeBtnLibrary) howToFindPaintCodeBtnLibrary.disabled = true;
}

function disableGetPaintCodeUsingVin() {
    if (getPaintCodeUsingVinLibrary) getPaintCodeUsingVinLibrary.disabled = true;
}

function disableSelectVinVariantBtn() {
    if (selectVinVariantButtonLibrary) selectVinVariantButtonLibrary.disabled = true;
}

function disableVinVerificationBtns() {
    if (vinVerifyCheckbboxYesLibrary) vinVerifyCheckbboxYesLibrary.disabled = true;
    if (vinVerifyCheckboxNoLibrary) vinVerifyCheckboxNoLibrary.disabled = true;
    if (vinVerificationButtonLibrary) vinVerificationButtonLibrary.disabled = true;
}

function clearVinVerificationRadioButtons() {
    const radios = document.querySelectorAll(`input[name="fitment_guarantee"]`);
    radios.forEach(radio => radio.checked = false);
    vinInputWrapper.classList.remove('show');
    vinInput.value = '';
}

function disableAddToCartButton() {
    if (currentAddToCartBtnLibrary) currentAddToCartBtnLibrary.disabled = true;
}




// ENABLING
function enableProductTypeSelect() {
    if (productTypeSelectLibrary) productTypeSelectLibrary.disabled = false;
}

function enableQualityDescriptionBtn() {
    if (qualityDescriptionBtnLibrary) qualityDescriptionBtnLibrary.disabled = false;
}

function enableVINTextboxForOEM() {
    if (vinTextBoxOEM) vinTextBoxOEM.disabled = false;
}

function enableCombinedVariantSelect() {
    if (combinedVariantSelectLibrary) combinedVariantSelectLibrary.disabled = false;
}

function enablehowToFindPaintCodeBtn() {
    if (howToFindPaintCodeBtnLibrary) howToFindPaintCodeBtnLibrary.disabled = false;
}

function enableGetPaintCodeUsingVin() {
    if (getPaintCodeUsingVinLibrary) getPaintCodeUsingVinLibrary.disabled = false;
}

function enableSelectVinVariantBtn() {
    if (selectVinVariantButtonLibrary) selectVinVariantButtonLibrary.disabled = false;
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
    const keyElement = document.querySelector('.painted-stock-key');
    if (!keyElement) return;
  
    keyElement.style.display = hasAvailableOptions[selectedType] ? 'block' : 'none';
  }

  function updatePriceDisplay(selectedType) {
    const selectedText = productTypeSelect.options[productTypeSelect.selectedIndex].textContent;
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