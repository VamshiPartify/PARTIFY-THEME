/*******************************************************************************************************
**                                                                                                    **
**                                             VARIABLES                                              **
**                                                                                                    **
*******************************************************************************************************/
const maxAttempts = 3;

let attemptedVinsInGarage = [];
let attemptedVinsVinVerification = [];
let attemptedVinsOEM = [];
let attemptedOEMVins = [];
let attemptedDecodedVins = [];
let attemptedDecodedLicensePlates = [];

let finalVinVerificationSubmissionVin = '';
let garageFirstVehicleData = '';
let themeName = '';
let autoSelectedColor = '';
let autoSelectedOption = '';
let storedDecodedVin = '';
let firstVehicleColor = '';
let licenseOptionMsg = '';
let vinOptionMsg = '';


let garageVinSubmissionBool = false;
let successfulVinVerificationVin = false;
let successfulVinDecoding = false;
let alreadyLogged = false;
let garageToCollections = false;
let decodedVINHasAvailableStock = false;
let autoSelectedBanned = false;

const vinInputLibrary = document.querySelector('#vin-textbox');
const vinTextboxContainer = document.getElementById("vin-textbox-container");
const vinOptionLabel = document.getElementById('paint-code-vin-option');
const licenseOptionLabel = document.getElementById('paint-code-license-option');
const storedOptionLabel = document.getElementById('paint-code-stored-option');
const checkboxStoredCodeText = document.querySelector('.checkbox-stored-code');
const checkboxStoredCodeMsg = document.querySelector('.checkbox-stored-msg');









/*******************************************************************************************************
**                                                                                                    **
**                                           GARAGE LOGIC                                             **
**                                                                                                    **
*******************************************************************************************************/
document.addEventListener("easysearch_rendered", function () {
  console.log("easysearch_rendered event fired!");
  addCustomEasysearchBtn();
});

// Fallback: if event already fired before listener registered
if (window.easysearchWasRendered) {
  console.log("easysearch_rendered event had already fired, running button logic immediately.");
  addCustomEasysearchBtn();
}

function addCustomEasysearchBtn() {
  const holders = document.querySelectorAll('.easysearch-holder');
  if (holders.length === 0) {
    console.log('[Global Library] No easysearch holders found, retrying...');
    setTimeout(addCustomEasysearchBtn, 500);
    return;
  }

  holders.forEach(function (holder) {
    // Prevent duplicate buttons
    if (holder.querySelector('.custom-easysearch-ymm-btn')) {
      return;
    }

    const actionsHolder = holder.querySelector('.easysearch-actions-holder');
    if (!actionsHolder) {
      console.log('[Global Library] No .easysearch-actions-holder found, retrying...');
      setTimeout(addCustomEasysearchBtn, 500);
      return;
    }

    const btnHolder = actionsHolder.querySelector('.easysearch-btn-holder');
    if (!btnHolder) {
      console.log('[Global Library] No .easysearch-btn-holder found, retrying...');
      setTimeout(addCustomEasysearchBtn, 500);
      return;
    }

    // Reference button for innerHTML
    const refBtn = document.getElementById('license-to-vin-btn');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'custom-easysearch-ymm-btn-id';
    btn.className = 'custom-easysearch-ymm-btn';
    btn.innerHTML = refBtn ? refBtn.innerHTML : 'Search';
    btn.disabled = true;
    holder.appendChild(btn);

    const anchor = btnHolder.querySelector('a');
    if (anchor) {
      function updateBtnState() {
        btn.disabled = !(anchor.href && !anchor.href.includes('javascript:void(0)'));
      }

      updateBtnState();

      const observer = new MutationObserver(() => updateBtnState());
      observer.observe(anchor, { attributes: true });

      btn.addEventListener('click', function () {
        if (btn.disabled) return;

        const year = document.getElementById('easysearch_field_4973');
        const make = document.getElementById('easysearch_field_4974');
        const model = document.getElementById('easysearch_field_4975');
        const submodel = document.getElementById('easysearch_field_28136');
        const engine = document.getElementById('easysearch_field_28137');

        updateEasysearchLocalStorageOrNavigate(
          year ?? null,
          make ?? null,
          model ?? null,
          submodel ?? null,
          engine ?? null,
          null,
          null
        );
      });
    }
  });
}


function getSearchTerms() {
  let terms = JSON.parse(localStorage.getItem('searchTerms')) || [];
  // Migrate if needed
  if (terms.length && typeof terms[0] === 'string') {
    terms = terms.map((ymm) =>
      typeof ymm === 'string'
        ? {
          ymm,
          vin: null,
          paintCode: null,
          year: null,
          make: null,
          model: null,
          submodel: null,
          engine: null,
          state: null,
          plate: null
        }
        : ymm
    );
    localStorage.setItem('searchTerms', JSON.stringify(terms));
  }
  terms = terms.map((entry) => {
    // If entry.ymm is an object, flatten it
    if (entry && typeof entry.ymm === 'object' && entry.ymm !== null) {
      entry = {
        ymm: entry.ymm.ymm,
        vin: entry.ymm.vin,
        paintCode: entry.ymm.paintCode,
        year: entry.ymm.year,
        make: entry.ymm.make,
        model: entry.ymm.model,
        submodel: entry.ymm.submodel,
        engine: entry.ymm.engine,
        state: entry.ymm.state,
        plate: entry.ymm.plate,
      };
    }
    return {
      ymm: entry.ymm,
      vin: entry.vin || null,
      paintCode: entry.paintCode || null,
      year: entry.year || null,
      make: entry.make || null,
      model: entry.model || null,
      submodel: entry.submodel || null,
      engine: entry.engine || null,
      state: entry.state || null,
      plate: entry.plate || null,
    };
  });

  // Set the items here to ensure it is in the correct format.  It is a fix for migration
  // Doesn't actually add more items to the garage
  localStorage.setItem('searchTerms', JSON.stringify(terms));
  return terms;
}

// --- moveVehicleToFront migrated from garage-script.liquid ---
function moveVehicleToFront(vehicleData) {
  let currentSearchTerms = getSearchTerms();
  // vehicleData can be a string (ymm) or an object
  let ymm = typeof vehicleData === 'string' ? vehicleData : vehicleData.ymm;

  let state = typeof vehicleData === 'string' ? null : vehicleData.state;
  let plate = typeof vehicleData === 'string' ? null : vehicleData.plate;

  // Find index where ymm matches exactly, or is contained in obj.ymm, or obj.ymm is contained in ymm
  let vehicleIndex = currentSearchTerms.findIndex(
    (obj) => obj.ymm === ymm || obj.ymm.includes(ymm) || ymm.includes(obj.ymm)
  );
  let vehicleObj;
  if (vehicleIndex > -1) {
    vehicleObj = currentSearchTerms.splice(vehicleIndex, 1)[0];
    // If either ymm contains the other, set ymm to the longer one
    if (vehicleObj.ymm !== ymm) {
      if (vehicleObj.ymm.length < ymm.length) {
        vehicleObj.ymm = ymm;
      }
    }
  } else {
    vehicleObj =
      typeof vehicleData === 'object'
        ? vehicleData
        : { ymm, vin: null, paintCode: null, year: null, make: null, model: null, submodel: null, engine: null, state: null, plate: null };
  }

  // If currentSearchTerms.state does not exist add it
  if (state) {
    vehicleObj.state = state;
  }

  if (plate) {
    vehicleObj.plate = plate;
  }
  currentSearchTerms.unshift(vehicleObj);
  if (currentSearchTerms.length > 5) currentSearchTerms.pop();
  setSearchTerms(currentSearchTerms);
  return currentSearchTerms;
}

function setSearchTerms(terms) {
  // Remove duplicates by trimmed ymm, keeping the first occurrence
  const uniqueTerms = [];
  const seen = new Set();

  for (const term of terms) {
    const trimmedYmm = term.ymm.trim();
    if (!seen.has(trimmedYmm)) {
      // Store the trimmed ymm in the object
      uniqueTerms.push({ ...term, ymm: trimmedYmm });
      seen.add(trimmedYmm);
    }
  }
  localStorage.setItem('searchTerms', JSON.stringify(uniqueTerms));
}

async function setSelectValueWhenReady(selectId, value, timeout = 3000) {
  const select = document.getElementById(selectId);
  let newValue = '';
  if (!select) return newValue;
  const start = Date.now();
  return new Promise((resolve) => {
    function trySet() {
      if (Array.from(select.options).some(opt => opt.value == value)) {
        select.value = value;
        newValue = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        resolve(newValue);
      } else if (Date.now() - start > timeout) {
        resolve(newValue); // Timed out, value not set
      } else {
        setTimeout(trySet, 50);
      }
    }
    trySet();
  });
}

function setFitmentObject(obj) {
  localStorage.setItem('easysearch-preselect-fitment', JSON.stringify(obj));
  localStorage.setItem('easysearch-preselect', JSON.stringify(obj));
}

function updateEasysearchLocalStorageOrNavigate(year, make, model, submodel, engine, vin, paintCode) {
  let anchor = null;
  const holder = document.querySelector('.easysearch-holder');
  const actionsHolder = holder?.querySelector('.easysearch-actions-holder');
  if (actionsHolder) {
    const btnHolder = actionsHolder.querySelector('.easysearch-btn-holder');
    if (btnHolder) {
      anchor = btnHolder.querySelector('a');
    }
  }

  const fields = [year, make, model, submodel, engine];
  const yearVal = year && year.value ? year.value.trim() : '';
  const makeVal = make && make.value ? make.value.trim() : '';
  const modelVal = model && model.value ? model.value.trim() : '';
  const submodelVal = submodel && submodel.value ? submodel.value.trim() : '';
  const engineVal = engine && engine.value ? engine.value.trim() : '';
  const vinVal = vin && vin.value ? vin.value.trim() : '';
  const paintCodeVal = paintCode && paintCode.value ? paintCode.value.trim() : '';
  const ymm = [yearVal, makeVal, modelVal, submodelVal, engineVal].filter(Boolean).join(' ');

  const isProductPage = window.location.pathname.includes('/products/');
  updateSearchTerms(ymm, yearVal, makeVal, modelVal, submodelVal, engineVal, vinVal, paintCodeVal);
  if (isProductPage) {
    updateProductPageFitment(ymm, fields, anchor);
  } else {
    window.location.href = anchor?.href;
  }
}


function updateProductPageFitment(ymm, fields, anchor) {
  let fitmentValue = '';
  const easySearchBtnSearch = document.querySelector('.easysearch-btn-search');
  let expires = Date.now() + 365 * 24 * 60 * 60 * 1000;
  // Build fitmentValue from the longest non-empty prefix of fields
  let prefix = [];
  for (let f of fields) {
    if (!f || f.value === '') {
      break;
    }
    prefix.push(f);
  }
  if (prefix.length === 0) {
    console.warn('Aborting fitmentValue creation: all fields are empty.');
    return;
  }
  fitmentValue = prefix
    .map(f => f.value + 'easysearch-preselect-delimiter')
    .join('');
  const fitmentObject = {
    value: fitmentValue,
    expires: expires.toString(),
  }
  setFitmentObject(fitmentObject);

  // Save current search parameters to localStorage or backend
  easysearch.saveSearchParams(easySearchBtnSearch);
  easysearch.addPropertyToProductForm();
  // Get the fitment widget element and the URL to load fitment results
  const fitWidget = document.querySelector('.easysearch-fitment-widget');
  const fitmentUrl = anchor?.href;

  // Function to trigger the fitment widget toggle after EasySearch is ready
  function triggerFitmentWidget() {
    if (window.easysearch && typeof easysearch.fitmentToggleWidget === 'function' && fitWidget && fitmentUrl) {
      easysearch.fitmentToggleWidget(fitWidget, fitmentUrl);
      document.removeEventListener('easysearch_init_native_search_page', triggerFitmentWidget);
    }
  }

  document.addEventListener('easysearch_init_native_search_page', triggerFitmentWidget);

  if (window.easysearch && typeof easysearch.fitmentToggleWidget === 'function') {
    easysearch.fitmentToggleWidget(fitWidget, fitmentUrl);
  }

  toggleGaragePopup();
  const hiddenEasysearchEl = document.querySelector('.easysearch-fitment-search-widget');
  const failOrSuccessEasysearchEl = document.querySelector('.easysearch-fitment-holder');
  if (hiddenEasysearchEl && !hiddenEasysearchEl.classList.contains('easysearch-hidden')) {
    hiddenEasysearchEl.classList.add('easysearch-hidden');
  }
  if (failOrSuccessEasysearchEl && failOrSuccessEasysearchEl.classList.contains('easysearch-hidden')) {
    failOrSuccessEasysearchEl.classList.remove('easysearch-hidden');
  }
}

function updateSearchTerms(ymm, yearVal, makeVal, modelVal, submodelVal, engineVal, vinVal, paintCodeVal) {
  // Custom deduplication and update logic
  let searchTerms = getSearchTerms();
  let foundIdx = searchTerms.findIndex(term =>
    term.year === yearVal &&
    term.make === makeVal &&
    term.model === modelVal
  );

  // Found a match on year, make, model
  if (ymm && foundIdx > -1) {
    let updated = false;
    // Update submodel if incoming is more specific
    if (submodelVal && (searchTerms[foundIdx].submodel === null || searchTerms[foundIdx].submodel === '' || searchTerms[foundIdx].submodel === undefined)) {
      searchTerms[foundIdx].submodel = submodelVal;
      updated = true;
    }
    // Update engine if incoming is more specific
    if (engineVal && (searchTerms[foundIdx].engine === null || searchTerms[foundIdx].engine === '' || searchTerms[foundIdx].engine === undefined)) {
      searchTerms[foundIdx].engine = engineVal;
      updated = true;
    }
    // Update VIN if it doesn't already exist
    if (vinVal && (searchTerms[foundIdx].vin === null || searchTerms[foundIdx].vin === '' || searchTerms[foundIdx].vin === undefined)) {
      searchTerms[foundIdx].vin = vinVal;
      updated = true;
    }
    // Update paintcode if it doesn't already exist
    if (paintCodeVal && (searchTerms[foundIdx].paintCode === null || searchTerms[foundIdx].paintCode === '' || searchTerms[foundIdx].paintCode === undefined)) {
      searchTerms[foundIdx].paintCode = paintCodeVal;
      updated = true;
    }
    // If both submodel and engine already match, do nothing
    if (!updated && (
      (searchTerms[foundIdx].submodel === submodelVal || (!submodelVal && (searchTerms[foundIdx].submodel === null || searchTerms[foundIdx].submodel === '' || searchTerms[foundIdx].submodel === undefined))) &&
      (searchTerms[foundIdx].engine === engineVal || (!engineVal && (searchTerms[foundIdx].engine === null || searchTerms[foundIdx].engine === '' || searchTerms[foundIdx].engine === undefined)))
    )) {
      // Do nothing
    } else if (updated) {
      setSearchTerms(searchTerms);
    } else {
      // If submodel/engine are different, add as new entry
      const newTerm = {
        ymm: ymm,
        vin: vinVal || null,
        paintCode: paintCodeVal || null,
        year: yearVal || null,
        make: makeVal || null,
        model: modelVal || null,
        submodel: submodelVal || null,
        engine: engineVal || null
      };
      searchTerms.unshift(newTerm);
      if (searchTerms.length > 5) searchTerms.splice(5);
      setSearchTerms(searchTerms);
    }

    // This is a new entry (did not find a match in garage)
  } else if (ymm) {
    // No match on year, make, model, so add new
    const newTerm = {
      ymm: ymm,
      vin: vinVal || null,
      paintCode: paintCodeVal || null,
      year: yearVal || null,
      make: makeVal || null,
      model: modelVal || null,
      submodel: submodelVal || null,
      engine: engineVal || null
    };
    searchTerms.unshift(newTerm);
    if (searchTerms.length > 5) searchTerms.pop();
    setSearchTerms(searchTerms);
  }
};

async function updateGarageAndNavigate(year, make, model, submodel, engine, vin, paintCode, state, plate) {
  const yearVal = await setSelectValueWhenReady('easysearch_field_4973', year || '');
  const makeVal = await setSelectValueWhenReady('easysearch_field_4974', make || '');
  const modelVal = await setSelectValueWhenReady('easysearch_field_4975', model || '');
  const submodelVal = await setSelectValueWhenReady('easysearch_field_28136', submodel || '');
  const engineVal = await setSelectValueWhenReady('easysearch_field_28137', engine || '');


  let formattedYmm = '';
  if (submodelVal && engineVal) {
    formattedYmm = `${yearVal} ${makeVal} ${modelVal} ${submodelVal || ''} ${engineVal || ''}`;
  } else if (submodelVal && !engineVal) {
    formattedYmm = `${yearVal} ${makeVal} ${modelVal} ${submodelVal || ''}`;
  } else {
    formattedYmm = `${yearVal} ${makeVal} ${modelVal}`;
  }

  moveVehicleToFront({
    ymm: formattedYmm,
    vin: vin || null,
    paintCode: paintCode || null,
    year: yearVal || null,
    make: makeVal || null,
    model: modelVal || null,
    submodel: submodelVal || null,
    engine: engineVal || null,
    state: state || null,
    plate: plate || null
  });
  if (!window.location.pathname.includes('/products/')) {
    const btnHolder = document.querySelector('.easysearch-btn-holder');
    if (btnHolder) {
      const anchor = btnHolder.querySelector('a');
      if (anchor) {
        const url = new URL(anchor.href);
        if (anchor.href && !anchor.href.includes('javascript:void(0)')) {
          window.location.href = url.pathname + url.search + url.hash;
        }
      }
    }
  } else {
    updateEasysearchLocalStorageOrNavigate(yearVal, makeVal, modelVal, submodelVal, engineVal, vin, paintCode);
    // If on product page and paint option is available in local storage, update paint 
    // options radio buttons
    firstVehicleColor = handleInsertLocalStoragePaintOption();
  }
}

// Used for generating the correct filtered URL for non compatible vehicles
function updateGarageFirstVehicleData() {
  const vehicleDataContainer = document.querySelector('.vehicle-item-container.first-vehicle-item-container .vehicle-browse-catalog-container strong[data-vehicle]');
  const notCompatibleBtnContainer = document.querySelector('.not-compatible-button');
  if (vehicleDataContainer) {
    garageFirstVehicleData = vehicleDataContainer.getAttribute('data-vehicle');
  }
  if (!garageFirstVehicleData) {
    if (notCompatibleBtnContainer) notCompatibleBtnContainer.style.display = 'none';
  } else {
    if (notCompatibleBtnContainer) notCompatibleBtnContainer.style.display = 'block';
  }
}



/*******************************************************************************************************
**                                                                                                    **
**                                             UTILITIES                                              **
**                                                                                                    **
*******************************************************************************************************/

async function getIpAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip; // Returns the client's public IP
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return null;
  }
};

/**
 * Retrieves the garage search terms from localStorage.
 *
 * @function
 * @returns {Array} An array of search term objects from localStorage, or an empty array if none exist.
 */
function getGarageSearchTerms() {
  return JSON.parse(localStorage.getItem('searchTerms')) || [];
}

function setVinDecoderInputValue(storedVinMsg, vinInputBox, vinSubmitBtn) {
  const garageSearchTerms = getGarageSearchTerms();
  if (garageSearchTerms && garageSearchTerms[0] && garageSearchTerms[0].vin) {
    const vin = garageSearchTerms[0].vin;
    const ymm = garageSearchTerms[0].ymm || '';
    if (storedVinMsg) {
      storedVinMsg.style.display = 'block';
      if (ymm === '') {
        storedVinMsg.textContent = `Using VIN: ${vin}`;
      } else {
        storedVinMsg.textContent = `Using ${vin} for your ${ymm}`;
      }
      vinInputBox.value = vin;
      vinSubmitBtn.disabled = false;
    }
  }
}

function removeVinDecoderInputValue(storedVinMsg, vinInputBox, vinSubmitBtn) {
  const garageSearchTerms = getGarageSearchTerms();
  if (garageSearchTerms && garageSearchTerms[0] && garageSearchTerms[0].vin) {
    if (storedVinMsg) {
      storedVinMsg.style.display = 'none';
      storedVinMsg.textContent = '';
      vinInputBox.value = '';
      vinSubmitBtn.disabled = true;
    }
  }
}

// Function to update garage and navigate
/**
 * Updates the VIN for a vehicle in the garage search terms and navigates to the specified collection page.
 *
 * @async
 * @function
 * @param {string} handle - The collection handle to navigate to.
 * @param {string} vin - The Vehicle Identification Number to update and include in the redirect URL.
 */
// async function updateGarageAndNavigate(handle, vin, ymm) {
//   let currentSearchTerms = getGarageSearchTerms();
//   const vehicleIndex = currentSearchTerms.findIndex((obj) => obj.ymm === ymm);
//   let vehicleObj = vehicleIndex > -1 ? currentSearchTerms[vehicleIndex] : null;

//   // Only if the vehicle exists already, insert a VIN if it is not already present
//   if (vehicleObj) {
//     if (!currentSearchTerms[vehicleIndex].vin) {
//       currentSearchTerms[vehicleIndex].vin = vin; // Update the vin in the existing object
//       localStorage.setItem('searchTerms', JSON.stringify(currentSearchTerms));
//     }
//   }
//   const redirectUrl = `/collections/${handle}${vin ? `?vin=${encodeURIComponent(vin)}` : ''}`;
//   window.location.href = redirectUrl;
// }

/*
    functionLocation - 1 = Garage
    functionLocation - 2 = Vin Verification
*/
// Function to handle VIN change
function handleVinChange(event, functionLocation, errorMsg) {
  let vinInput = event.target.value.toUpperCase();
  const filteredValue = vinInput.replace(/[IOQ\s:;()!@#$%^?'"&*\-_=+.`~<>{}\[\]|,\/\\]/gi, '');
  const truncatedValue = filteredValue.slice(0, 17);

  event.target.value = truncatedValue;

  if (functionLocation === 1) {
    if (attemptedVinsInGarage.length) {
      for (let i = 0; i < attemptedVinsInGarage.length; i++) {
        if (attemptedVinsInGarage[i].toUpperCase() === truncatedValue.toUpperCase()) {
          document.querySelector('.errorMessageVIN').style.visibility = 'visible';
          document.querySelector('.errorMessageVIN').innerHTML = 'VIN already searched. Please try a different VIN';
          document.getElementById('vin-to-collection-btn').disabled = true;
          return;
        } else {
          document.querySelector('.errorMessageVIN').style.visibility = 'hidden';
        }
      }
    }

    if (truncatedValue.length === 17) {
      document.getElementById('vin-to-collection-btn').disabled = false;
    } else {
      document.getElementById('vin-to-collection-btn').disabled = true;
    }

    if (vinInput !== filteredValue) {
      alert(errorMsg);
    }
  } else if (functionLocation === 2) {
    if (attemptedVinsVinVerification.length) {
      for (let i = 0; i < attemptedVinsVinVerification.length; i++) {
        if (attemptedVinsVinVerification[i].toUpperCase() === truncatedValue.toUpperCase()) {
          document.querySelector('.vin-verification-submission-failed-message').style.display = 'block';
          document.querySelector('.vin-verification-submission-failed-message').innerHTML = 'VIN already searched. Please try a different VIN';
          // document.getElementById('vin-to-collection-btn').disabled = true;
          return true;
        } else {
          document.querySelector('.vin-verification-submission-failed-message').style.display = 'none';
        }
      }
    }

    if (truncatedValue.length === 17) {
      document.getElementById('vin-to-collection-btn').disabled = false;
    } else {
      document.getElementById('vin-to-collection-btn').disabled = true;
    }

    if (vinInput !== filteredValue) {
      alert(errorMsg);
    }
  } else if (functionLocation === 3) {
    if (attemptedDecodedVins.length) {
      for (let i = 0; i < attemptedDecodedVins.length; i++) {
        if (attemptedDecodedVins[i].toUpperCase() === truncatedValue.toUpperCase()) {
          document.querySelector('.vin-decoder-submission-failed-message').style.display = 'block';
          document.querySelector('.vin-decoder-submission-failed-message').innerHTML = 'VIN already searched. Please try a different VIN';
          // document.getElementById('vin-to-collection-btn').disabled = true;
          return true;
        } else {
          document.querySelector('.vin-decoder-submission-failed-message').style.display = 'none';
        }
      }
    }

    if (truncatedValue.length === 17) {
      document.getElementById('vin-to-collection-btn').disabled = false;
    } else {
      document.getElementById('vin-to-collection-btn').disabled = true;
    }

    if (vinInput !== filteredValue) {
      alert(errorMsg);
    }
  }
};

function handleLicenseChange(event, functionLocation, errorMsg, id) {
  let licenseInput = event.target.value.toUpperCase();
  event.target.value = licenseInput;
  const licenseBtn = document.getElementById(id);
  if (licenseInput.length > 0) {
    licenseBtn.disabled = false;
  } else {
    licenseBtn.disabled = true;
  }
}

async function createCompanyProfile(companyName, firstName, lastName, email, phone, title, address, city, zipCode, stateAbbr, locationName, pdf, taxRegistrationId, typeText, reasonText) {
  try {
    const response = await fetch('https://tax-exemption-signup-505215902673.us-east5.run.app/createCustomerProfile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName,
        firstName,
        lastName,
        email,
        phone,
        title,
        address,
        city,
        zipCode,
        stateAbbr,
        locationName,
        pdf,
        taxRegistrationId,
        typeText,
        reasonText
      }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching order details. Status: ${response.status}. Message: ${response.statusText}.`);
    }
    const data = await response.json();
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
  }
}

/*
    functionLocation - 1 = Garage
    functionLocation - 2 = Vin Verification
    functionLocation - 3 = Vin Decoder - Vin Lookup
    functionLocation - 4 = Vin Decoder - License Plate Lookup
    functionLocation - 5 = OEM
*/
async function fetchVehicleDataByVin(state, plate, vin, functionLocation, noResults, failed3times, searchBtn, tailoredSuccessMessage, failedAttemptMsg, remainingAttempts, troublesomeMakesColors, bumperdotcommake) {
  const vinSearchBtn = document.getElementById("vin-to-collection-btn");
  const errorMessageVIN = document.querySelector('.errorMessageVIN');
  let calculatedRemainingAttemptsVinVerification = maxAttempts - attemptedVinsVinVerification.length;
  let calculatedRemainingAttemptsVinDecoder = maxAttempts - attemptedDecodedVins.length;
  let calculatedRemainingAttemptsLicenseDecoder = maxAttempts - attemptedDecodedLicensePlates.length;
  const vinGuaranteeFetchingMsg = document.querySelector('.vin-verification-fetching-vin-data');
  const vinDecoderFetchingMsg = document.querySelector('.vin-decoder-fetching-vin-data');
  let partifyLocation = await getPartifyLocation();
  let parentUrl = window.location.href;
  let response = '';
  let data = '';
  let dataResult = '';
  let description = '';
  let vehicleError = false;
  let validVin = false;
  let exteriorColors = [];
  let colorCode = '';
  let year = '';
  let make = '';
  let model = '';
  let ymm = '';
  let site = '';
  let styleId = '';
  let genericDesc = '';
  let fullDescription = '';
  let hex = '';
  let errorMessage = '';

  try {
    if (vinGuaranteeFetchingMsg) vinGuaranteeFetchingMsg.style.display = "block";
    if (vinDecoderFetchingMsg) vinDecoderFetchingMsg.style.display = "block";

    // Check if vin is empty.. if so, then license lookup failed
    if (vin.length === 17) {
      if (bumperdotcommake && bumperdotcommake === true) {
        response = await fetch(`https://bumperdotcom-api-345230973812.us-east5.run.app/bumperdotcom-api?vin=${vin}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        data = await response.json();

        if (!response.ok) {
          validVin = false;
          errorMessage = `Error fetching order details. Status: ${response.status}. Message: ${response.statusText}.`;
          throw new Error(`Error fetching order details. Status: ${response.status}`);
        }

        vehicleError = data.entities.vehicles.automobiles.length === 0;
        validVin = true;
        exteriorColors = data.entities.vehicles.automobiles[0]?.design?.colors || [];
        if (exteriorColors.length > 0) {
          let exteriorCounter = 0;
          exteriorColors.forEach((color) => {
            if (color.category === "Exterior") {
              if (exteriorCounter === 0) {
                colorCode = color.code || '';
              } else {
                colorCode = '';
              }
              exteriorCounter++;
            }
          })
          if (exteriorCounter > 1) {
            errorMessage = `Too many paint codes to determine`;
          }
        } else {
          errorMessage = `No exterior colors found for the provided VIN: ${vin}`;
        }
        description = data.entities.vehicles.automobiles[0]?.design?.current_color?.name || '';
        year = data.entities.vehicles.automobiles[0]?.year || '';
        make = data.entities.vehicles.automobiles[0]?.make || '';
        model = data.entities.vehicles.automobiles[0]?.model || '';
        ymm = `${year} ${make} ${model}`.trim();
        site = "Bumper.com";
        genericDesc = data.entities.vehicles.automobiles[0]?.design?.current_color?.generic_name || '';
        fullDescription = data.entities.vehicles.automobiles[0]?.design?.current_color?.name || '';
        hex = data.entities.vehicles.automobiles[0]?.design?.current_color?.hex || '';
      } else {
        response = await fetch('https://garage-vin-service-node-740168228309.us-east5.run.app/fetchVehicleData', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vin: vin,
          }),
        });

        if (!response.ok) {
          if (data.vehicleData.message === "Invalid vin") {
            validVin = false;
          }
          errorMessage = `Error fetching order details. Status: ${response.status}. Message: ${response.statusText}.`;
          throw new Error(`Error fetching order details. Status: ${response.status}. Message: ${response.statusText}.`);
        }

        data = await response.json();
        if (data.vehicleData.message === "The VIN passed was modified to convert invalid characters") {
          errorMessage = `The VIN passed was modified to convert invalid characters.`;
          validVin = false;
        }

        dataResult = data.vehicleData.result;
        description = dataResult.exteriorColors[0]?.description || '';
        vehicleError = data.vehicleData.error || false;
        validVin = dataResult.validVin || false;
        exteriorColors = dataResult.exteriorColors || [];
        year = dataResult.year || '';
        make = dataResult.make || '';
        model = dataResult.model || '';
        ymm = `${year} ${make} ${model}`.trim();
        site = 'ChromeData';
        styleId = dataResult.exteriorColors[0]?.styles[0] || '';
        genericDesc = dataResult.exteriorColors[0]?.genericDesc || '';
        fullDescription = dataResult.exteriorColors[0]?.description || '';
        hex = dataResult.exteriorColors[0]?.rgbHexValue || '';

        if (exteriorColors.length === 1) {
          colorCode = exteriorColors[0]?.colorCode || '';
        } else if (exteriorColors.length > 1) {
          errorMessage = `Too many paint codes to determine.`;
        }
      }
    } else {
      vehicleError = true;
      validVin = false;
    }
    // Garage
    if (functionLocation === 1) {
      // NOTE: The data returns the paint code here! No need to alter gcr function as I can 
      // just use the paint code from the data object here.
      if (data.handle === '') {
        if (!alreadyLogged) {
          logGarageUsageToSheets(vin, '', '', '', '', '', 'No vehicles found for the provided VIN.', 'Garage VIN Submission');
        } else {
          // If already logged, reset the flag so it can be logged again if needed.
          alreadyLogged = false;
        }
        if (attemptedVinsInGarage.length < maxAttempts) {
          errorMessageVIN.innerHTML = noResults;
          errorMessageVIN.style.visibility = 'visible';
        } else {
          errorMessageVIN.innerHTML = failed3times;
          errorMessageVIN.style.visibility = 'visible';
          document.getElementById('vin').disabled = true;
          return;
        }
        garageVinSubmissionBool = false;
        return;
      } else {
        // Don't add garageVinSubmissionBool here because there will be a time when the button
        // is clickable between submission and page navigation.  Don't want anyone spamming
        // the button.
        if (!alreadyLogged) {
          logGarageUsageToSheets(vin, '', '', data.year, data.make, data.model, '', 'Garage VIN Submission');
        } else {
          // If already logged, reset the flag so it can be logged again if needed.
          alreadyLogged = false;
        }

        updateGarageAndNavigate(year.toString(), make, model, '', '', vin, colorCode, state, plate);
      }

      // Vin Verification
    } else if (functionLocation === 2) {
      if (data.handle === '' || data.isVinValid === false) {
        if (attemptedVinsVinVerification.length < maxAttempts) {

          document.querySelector('.vin-verification-submission-failed-message').innerHTML = noResults;
          document.querySelector('.vin-verification-remaining-attempts').style.display = "block";
          document.querySelector('.vin-verification-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttemptsVinVerification;
        } else {
          document.querySelector('.vin-verification-submission-failed-message').innerHTML = failed3times;
          document.getElementById('vin-textbox-for-verification').value = '';
          document.getElementById('vin-textbox-for-verification').disabled = true;
          document.querySelector('.vin-verification-remaining-attempts').style.display = "block";
          document.querySelector('.vin-verification-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttemptsVinVerification;
          finalVinVerificationSubmissionVin = vin;
        }
        document.querySelector('.vin-verification-submission-success-message').style.display = "none";
        document.querySelector('.vin-verification-submission-failed-message').style.display = "block";
        return false;
      } else {
        document.querySelector('.vin-verification-submission-success-message').innerHTML = tailoredSuccessMessage + `${data.year} ${data.make} ${data.model}`;
        document.querySelector('.vin-verification-submission-failed-message').style.display = "none";
        document.querySelector('.vin-verification-submission-success-message').style.display = "block";
        document.getElementById('vin-textbox-for-verification').disabled = true;
        document.querySelector('.vin-verification-remaining-attempts').style.display = "none";

        finalVinVerificationSubmissionVin = vin;
        successfulVinVerificationVin = true;

        return true;
      }

      // Vin Decoder
    } else if (functionLocation === 3) {
      if (attemptedDecodedVins.length <= maxAttempts) {
        let troublesomeMake = false;
        if (Object.keys(troublesomeMakesColors).length > 0) troublesomeMake = true;

        if (vehicleError === false || validVin === true) {
          if (troublesomeMake === true) {
            const keys = Object.keys(troublesomeMakesColors);
            let matchedKey = keys.find((key) => {
              const colorArray = key.split(',').map(color => color.trim()); // Trim spaces for clean comparison
              return colorArray.some(color => color === description); // Check for an exact match
            });
            successfulVinDecoding = true;
            if (!matchedKey) {
              errorMessage = `Troublesome paintcode found: ${colorCode}. ${description} does not match any description in the metadata fields.`;
            }
            colorCode = matchedKey ? troublesomeMakesColors[matchedKey] : '';
            return { validVin: true, ymm: ymm, paintCode: colorCode || '' };
          } else {
            successfulVinDecoding = true;
            return { validVin: true, ymm: ymm, paintCode: colorCode || '' };
          }
        } else {
          if (errorMessage === '') {
            errorMessage = `Error fetching vehicle data.`;
          }
          document.querySelector('.vin-decoder-submission-failed-message').innerHTML = noResults;
          document.querySelector('.vin-decoder-failed-attempt').style.display = "block";
          document.querySelector('.vin-decoder-failed-attempt').innerHTML = failedAttemptMsg + vin;
          document.querySelector('.vin-decoder-remaining-attempts').style.display = "block";
          document.querySelector('.vin-decoder-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttemptsVinDecoder;
          return { validVin: false, ymm: '', paintCode: '' };
        }
      } else {
        if (errorMessage === '') {
          errorMessage = `Failed 3 times. Error fetching vehicle data.`;
        }
        // Vin Decoder failed 3 times
        document.querySelector('.vin-decoder-submission-failed-message').innerHTML = failed3times;
        document.querySelector('.vin-decoder-submission-failed-message').style.display = "block";
        document.querySelector('.vin-decoder-failed-attempt').style.display = "block";
        document.querySelector('.vin-decoder-failed-attempt').innerHTML = failedAttemptMsg + vin;
        document.querySelector('.vin-decoder-remaining-attempts').style.display = "block";
        document.querySelector('.vin-decoder-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttemptsVinDecoder;
        successfulVinDecoding = false;
        return { validVin: false, ymm: '', paintCode: '' };
      }
    } else if (functionLocation === 4) {
      if (attemptedDecodedLicensePlates.length <= maxAttempts) {
        let troublesomeMake = false;
        if (Object.keys(troublesomeMakesColors).length > 0) troublesomeMake = true;

        if (vehicleError === false || validVin === true) {
          if (troublesomeMake === true) {
            const keys = Object.keys(troublesomeMakesColors);
            let matchedKey = keys.find((key) => {
              const colorArray = key.split(',').map(color => color.trim()); // Trim spaces for clean comparison
              return colorArray.some(color => color === description); // Check for an exact match
            });
            if (!matchedKey) {
              errorMessage = `Troublesome paintcode found: ${colorCode}. ${description} does not match any description in the metadata fields.`;
            }
            colorCode = matchedKey ? troublesomeMakesColors[matchedKey] : '';
            successfulVinDecoding = true;
            return { validVin: true, ymm: ymm, paintCode: colorCode || '' };
          } else {
            successfulVinDecoding = true;
            return { validVin: true, ymm: ymm, paintCode: colorCode || '' };
          }
        } else {
          if (errorMessage === '') {
            errorMessage = `Error fetching vehicle data.`;
          }
          document.querySelector('.license-decoder-submission-failed-message').innerHTML = noResults;
          document.querySelector('.license-decoder-failed-attempt').style.display = "block";
          document.querySelector('.license-decoder-failed-attempt').innerHTML = failedAttemptMsg + vin;
          document.querySelector('.license-decoder-remaining-attempts').style.display = "block";
          document.querySelector('.license-decoder-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttemptsLicenseDecoder;
          return { validVin: false, ymm: '', paintCode: '' };
        }
      } else {
        if (errorMessage === '') {
          errorMessage = `Failed 3 times. Error fetching vehicle data.`;
        }
        document.querySelector('.license-decoder-submission-failed-message').innerHTML = failed3times;
        document.querySelector('.license-decoder-submission-failed-message').style.display = "block";
        document.querySelector('.license-decoder-failed-attempt').style.display = "block";
        document.querySelector('.license-decoder-failed-attempt').innerHTML = failedAttemptMsg + vin;
        document.querySelector('.license-decoder-remaining-attempts').style.display = "block";
        document.querySelector('.license-decoder-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttemptsLicenseDecoder;
        successfulVinDecoding = false;
        return { validVin: false, ymm: '', paintCode: '' };
      }
    }
  } catch (error) {
    if (functionLocation === 1) {
      if (errorMessageVIN.style.visibility === 'hidden') {
        errorMessageVIN.style.visibility = 'visible';
      }
      vinSearchBtn.disabled = true;
      logGarageUsageToSheets(vin, '', '', '', '', '', error.message, 'Garage VIN Submission');
      if (attemptedVinsInGarage.length < maxAttempts) {
        errorMessageVIN.innerHTML = noResults;
      } else {
        errorMessageVIN.innerHTML = failed3times;
        document.getElementById('vin').disabled = true;
        console.error("Error fetching vehicle data:", error);
        return;
      }
      garageVinSubmissionBool = false;
    } else if (functionLocation === 2) {
      attemptedVinsVinVerification.push(vin);
      if (attemptedVinsVinVerification.length < maxAttempts) {
        document.querySelector('.vin-verification-submission-failed-message').innerHTML = noResults;
        document.querySelector('.vin-verification-remaining-attempts').style.display = "block";
        document.querySelector('.vin-verification-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttemptsVinVerification;
      } else {
        document.querySelector('.vin-verification-submission-failed-message').innerHTML = failed3times;
        document.getElementById('vin-textbox-for-verification').disabled = true;
        document.querySelector('.vin-verification-remaining-attempts').style.display = "block";
        document.querySelector('.vin-verification-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttemptsVinVerification;
        finalVinVerificationSubmissionVin = vin;
      }
      document.querySelector('.vin-verification-submission-success-message').style.display = "none";
      document.querySelector('.vin-verification-submission-failed-message').style.display = "block";
      console.error("Error fetching vehicle data:", error);
      return false;
    } else if (functionLocation === 3) {
      if (attemptedDecodedVins.length <= maxAttempts) {
        if (errorMessage === '') {
          errorMessage = `Error fetching vehicle data: ${error.message}`;
        }
        document.querySelector('.vin-decoder-submission-failed-message').innerHTML = noResults;
        document.querySelector('.vin-decoder-failed-attempt').style.display = "block";
        document.querySelector('.vin-decoder-failed-attempt').innerHTML = failedAttemptMsg + vin;
        document.querySelector('.vin-decoder-remaining-attempts').style.display = "block";
        document.querySelector('.vin-decoder-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttemptsVinDecoder;
      } else {
        if (errorMessage === '') {
          errorMessage = `Failed 3 times. Error fetching vehicle data: ${error.message}`;
        }
        document.querySelector('.vin-decoder-submission-failed-message').innerHTML = failed3times;
        document.querySelector('.vin-decoder-submission-failed-message').style.display = "block";
        document.querySelector('.vin-decoder-failed-attempt').style.display = "block";
        document.querySelector('.vin-decoder-failed-attempt').innerHTML = failedAttemptMsg + vin;
        document.querySelector('.vin-decoder-remaining-attempts').style.display = "none";
        document.querySelector('.vin-decoder-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttemptsVinDecoder;
      }
      return { validVin: false, paintCode: '' };
    } else if (functionLocation === 4) {
      if (attemptedDecodedLicensePlates.length <= maxAttempts) {
        if (errorMessage === '') {
          errorMessage = `Error fetching vehicle data: ${error.message}`;
        }
        document.querySelector('.license-decoder-submission-failed-message').innerHTML = noResults;
        document.querySelector('.license-decoder-failed-attempt').style.display = "block";
        document.querySelector('.license-decoder-failed-attempt').innerHTML = failedAttemptMsg + vin;
        document.querySelector('.license-decoder-remaining-attempts').style.display = "block";
        document.querySelector('.license-decoder-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttemptsLicenseDecoder;
      } else {
        if (errorMessage === '') {
          errorMessage = `Failed 3 times. Error fetching vehicle data: ${error.message}`;
        }
        document.querySelector('.license-decoder-submission-failed-message').innerHTML = failed3times;
        document.querySelector('.license-decoder-submission-failed-message').style.display = "block";
        document.querySelector('.license-decoder-failed-attempt').style.display = "block";
        document.querySelector('.license-decoder-failed-attempt').innerHTML = failedAttemptMsg + vin;
        document.querySelector('.license-decoder-remaining-attempts').style.display = "none";
        document.querySelector('.license-decoder-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttemptsLicenseDecoder;
      }
      return { validVin: false, paintCode: '' };
    }
    console.error("Error fetching vehicle data:", error);
  } finally {
    if (vinGuaranteeFetchingMsg) vinGuaranteeFetchingMsg.style.display = "none";
    if (vinDecoderFetchingMsg) vinDecoderFetchingMsg.style.display = "none";

    if (functionLocation === 1) {
      vinSearchBtn.classList.remove("vin-to-collection-btn--loading");
      vinSearchBtn.innerHTML = searchBtn;
    }

    if (functionLocation === 3 || functionLocation === 4) {
      decoderLoggerWebhook(state, plate, vin, site, year, make, model, styleId, colorCode, errorMessage, partifyLocation, parentUrl, genericDesc, fullDescription, hex);
    }
  }
}

// Uncomment the following function whenever we get more bumper credits
async function fetchBumpersLicenseToVin(state, plate) {
  try {
    alreadyLogged = false;
    const response = await fetch(`https://license-to-vin-273472976974.us-east5.run.app/license-to-vin?state=${state}&plate=${plate}`, {
      method: 'Get',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error fetching order details. Status: ${response.status}. Message: ${response.statusText}.`);
    }
    const data = await response.json();
    const vin = data.entities?.vehicles?.automobiles[0]?.vin
    const year = data.entities?.vehicles?.automobiles[0]?.year;
    const make = data.entities?.vehicles?.automobiles[0]?.make;
    const model = data.entities?.vehicles?.automobiles[0]?.model;

    if (data.entities?.vehicles?.automobiles.length > 0) {
      logGarageUsageToSheets(vin, plate, state, year, make, model, '', 'License To VIN');
      alreadyLogged = true;
    } else {
      console.error("No vehicles found for the provided license plate.");
      document.getElementById('license-to-vin-btn').disabled = true;
      document.querySelector('.errorMessageLicense').style.visibility = 'visible';
      document.querySelector('.errorMessageLicense').innerHTML = "No vehicles found for the provided license plate.";
      logGarageUsageToSheets(vin, plate, state, year, make, model, 'No vehicles found for the provided license plate.', 'License To VIN');
    }

    return { vin, year, make, model };
  } catch (error) {
    logGarageUsageToSheets('', plate, state, '', '', '', error.message, 'License To VIN');
    document.getElementById('license-to-vin-btn').disabled = true;
    document.querySelector('.errorMessageLicense').style.visibility = 'visible';
    document.querySelector('.errorMessageLicense').innerHTML = "Error fetching vehicle data. Please try again later.";
    console.error("Error fetching vehicle data:", error);
  }
}

async function handleVinDecode(
  vinInput,
  state,
  licensePlate,
  location,
  troublesomeMakesColors,
  bumperdotcommake,
  failed3timesmsg,
  noResults,
  searchBtn,
  tailoredSuccessMessage,
  failedAttemptMsg,
  remainingAttempts,
  vinDecoderFirstMsg,
  vinDecoderEndMsg,
  forceSelectMsgStart,
  forceSelectMsgEnd
) {
  let searchTerms = getGarageSearchTerms();
  let exteriorColor = '';

  // Returns isVinValid and Paint code (if no paint code, returns empty string)
  const { validVin, ymm, paintCode } = await fetchVehicleDataByVin(state, licensePlate, vinInput, location, noResults, failed3timesmsg, searchBtn, tailoredSuccessMessage, failedAttemptMsg, remainingAttempts, troublesomeMakesColors, bumperdotcommake);
  if (validVin) {
    // Vin is valid and paint code is found
    handleAutoSelectColor(
      paintCode,
      vinInput,
      licensePlate,
      location,
      vinDecoderFirstMsg,
      vinDecoderEndMsg,
      forceSelectMsgStart,
      forceSelectMsgEnd
    );
    searchTerms[0].vin = vinInput;
    if (state) {
      searchTerms[0].state = state;
    }
    if (licensePlate) {
      searchTerms[0].plate = licensePlate;
    }
    if (paintCode !== '') {
      if (Array.isArray(searchTerms) && searchTerms.length > 0) {
        const firstYMM = searchTerms[0].ymm || '';
        if (firstYMM === ymm) {
          searchTerms[0].paintCode = paintCode;
        }
      }
    }

    setSearchTerms(searchTerms);
    window.GarageLogic.updateGaragePopup(getSearchTerms());
  } else {
    // Vin is not valid
  }

  return validVin;
}

function handleAutoSelectColor(paintCode, vinInput, licensePlate, location, decoderFirstMsg, decoderEndMsg, forceSelectMsgStart, forceSelectMsgEnd) {
  const paintCodeWrapper = document.querySelector('.paint-code-wrapper');
  const paintcodeAppContainer = document.getElementById('paintcode-app-container');
  const variantSelector = document.getElementById('variant-selector');
  const paintedStockKeyLevel = document.querySelector('.painted-stock-key-paint-level');
  let matchingOption = false;

  if (variantSelector) {
    const options = Array.from(variantSelector.options);
    options.find(option => {
      if (option.label.split(" ")[0] === paintCode) {
        matchingOption = true;
        if (option.textContent.includes("🚚")) {
          decodedVINHasAvailableStock = true;
        }
        autoSelectedColor = option.value;
        autoSelectedOption = option;
        return true;
      }
    });

    if (matchingOption) {
      storedDecodedVin = vinInput;
      if (autoSelectedOption.dataset.unavailable === 'true') {
        autoSelectedBanned = true;
      }
      variantSelector.value = autoSelectedColor;
      document.body.classList.remove('no-scroll-paint-swatch');
      if (window.enablePrepaintedMessaging) {
        if (decodedVINHasAvailableStock) {
          paintedStockKeyLevel.style.display = 'block';
        }
      }
      if (!autoSelectedBanned) {
        // Create a new message to indicate the selected VIN
        if (location === 3) {
          const vinMessage = document.createElement('div');
          vinMessage.className = 'vin-decoder-message';
          vinMessage.style.display = 'block';
          vinMessage.innerHTML = `
                          <strong style="color: #444;">${decoderFirstMsg}</strong>
                          <span style="color: #000; font-weight: 800;">${vinInput},</span>
                          <span style="color: #444;">${decoderEndMsg}</span>
                          <span style="color: #000; font-weight: 800;">${paintCode}</span>
                      `;
          if (paintCodeWrapper) paintCodeWrapper.appendChild(vinMessage);
        }

        if (location === 4) {
          const vinMessage = document.createElement('div');
          vinMessage.className = 'license-decoder-message';
          vinMessage.style.display = 'block';
          vinMessage.innerHTML = `
                          <strong style="color: #444;">${decoderFirstMsg}</strong>
                          <span style="color: #000; font-weight: 800;">${licensePlate},</span>
                          <span style="color: #444;">${decoderEndMsg}</span>
                          <span style="color: #000; font-weight: 800;">${paintCode}</span>
                      `;
          if (paintCodeWrapper) paintCodeWrapper.appendChild(vinMessage);
        }
      }
      // Trigger the change event programmatically
      variantSelector.dispatchEvent(new Event('change', { bubbles: true }));
      if (typeof vinInputLibrary !== 'undefined' && vinInputLibrary) {
        vinInputLibrary.value = vinInput;
      }
    } else {
      resortToForceSelectCode();
      formulateForcePaintCodeSelectMsg(vinInput, licensePlate, forceSelectMsgStart, forceSelectMsgEnd, location);
      console.warn(`No matching option found for paint code: ${paintCode} using the vin: ${vinInput}`);
    }
  } else {
    console.warn('Variant selector dropdown not found.');
  }
  if (location === 3) {
    const paintCodeAppContainer = document.getElementById('paintcode-app-container');
    if (paintCodeAppContainer) paintCodeAppContainer.classList.remove('show');
  }

  if (location === 4) {
    const paintCodeAppContainerLicense = document.getElementById('paintcode-app-container-license');
    if (paintCodeAppContainerLicense) paintCodeAppContainerLicense.classList.remove('show');
  }

  if (paintCodeWrapper) paintCodeWrapper.classList.add('show');
}

function handleInsertLocalStoragePaintOption() {
  const garageSearchTerms = getGarageSearchTerms();
  let firstItemColor = '';
  let firstItemState = '';
  let firstItemPlate = '';
  let firstItemVin = '';
  let foundMatchingColor = false;
  if (garageSearchTerms && garageSearchTerms.length) {
    firstItemColor = garageSearchTerms[0]?.paintCode;
    firstItemState = garageSearchTerms[0]?.state;
    firstItemPlate = garageSearchTerms[0]?.plate;
    firstItemVin = garageSearchTerms[0]?.vin;

    // If the color exists in local storage
    if (firstItemColor) {
      const allVariantOptions = window.productVariants;

      // Set sampleArrToCheck to the first existing array within window.productVariants (NOTE: all product qualities should have the same
      // paint variants)
      const sampleArrToCheck = allVariantOptions.aftermarket || allVariantOptions.capa || allVariantOptions.oem || allVariantOptions.current;
      for (let i = 0; i < sampleArrToCheck.length; i++) {
        const option = sampleArrToCheck[i];
        if (firstItemColor === option.variantTitle) {
          foundMatchingColor = true;
        }
      }

      // If the color stored in local storage is found to match a variant option, display matching option and hide VIN and license option
      if (foundMatchingColor) {
        storedOptionLabel.style.display = 'block';
        checkboxStoredCodeText.innerHTML = firstItemColor;

        // If both state and plate exist in local storage, render the paint option message accordingly
        if (firstItemState && firstItemPlate) {
          checkboxStoredCodeMsg.innerHTML = licenseOptionMsg + firstItemState + '-' + firstItemPlate + ')';

          // If no state or plate exist but a vin does, render the paint option accordingly
        } else if (firstItemVin) {
          checkboxStoredCodeMsg.innerHTML = vinOptionMsg + firstItemVin + ')';
        }
        if (vinOptionLabel) {
          vinOptionLabel.style.display = 'none';
        }
        if (licenseOptionLabel) {
          licenseOptionLabel.style.display = 'none';
        }

        // If the color stored in local storage does not match a variant option, just hide VIN and license option
      } else {
        if (vinOptionLabel) {
          vinOptionLabel.style.display = 'none';
        }
        if (licenseOptionLabel) {
          licenseOptionLabel.style.display = 'none';
        }
      }

      // If vehicle exists in garage but does not have a color associated with it yet,
      // ensure the VIN and license options are displayed
    } else {
      if (vinOptionLabel) {
        vinOptionLabel.style.display = 'block';
      }
      if (licenseOptionLabel) {
        licenseOptionLabel.style.display = 'block';
      }
    }
  }


  return firstItemColor;
}

function resortToForceSelectCode() {
  const paintCodeWrapper = document.querySelector(".paint-code-wrapper");
  const paintCodeCheckbox = document.getElementById('checkbox-select-paint-option');
  paintCodeWrapper.classList.add('show');
  paintCodeCheckbox.checked = true;

  // Hide both checkboxes if they exist
  const vinCheckboxLabel = document.querySelector('input#checkbox-get-paint-code-with-vin')?.closest('label');
  if (vinCheckboxLabel) vinCheckboxLabel.style.display = 'none';

  const licenseCheckboxLabel = document.querySelector('input#checkbox-get-paint-code-with-license')?.closest('label');
  if (licenseCheckboxLabel) licenseCheckboxLabel.style.display = 'none';
}


function formulateForcePaintCodeSelectMsg(vin, licensePlate, forceSelectMsgStart, forceSelectMsgEnd, location) {
  const vinDecoderMessage = document.querySelector('.vin-decoder-message');
  if (!vinDecoderMessage) {
    const paintCodeWrapper = document.querySelector('.paint-code-wrapper');
    // const existingMessage = vinTextboxContainer.querySelector('.vin-selected-message');
    // vinTextboxContainer.style.display = "block";

    // // Remove any existing message to avoid duplication
    // if (existingMessage) {
    //   existingMessage.remove();
    // }

    // Create a new message to indicate the selected VIN
    const vinMessage = document.createElement('div');
    vinMessage.className = 'vin-decoder-message resort-to-force-select';
    vinMessage.style.display = 'block';
    if (location === 3) {
      vinMessage.innerHTML = `
        <strong style="color: #444;">${forceSelectMsgStart}</strong> 
        <span style="color: #000; font-weight: 800;">${vin}.</span> 
        <span style="color: #444;">${forceSelectMsgEnd}</span> 
      `;
    }

    if (location === 4) {
      vinMessage.innerHTML = `
        <strong style="color: #444;">${forceSelectMsgStart}</strong> 
        <span style="color: #000; font-weight: 800;">${licensePlate}.</span> 
        <span style="color: #444;">${forceSelectMsgEnd}</span> 
      `;
    }
    vinMessage.style.backgroundColor = '#ffbc2c17';
    vinMessage.style.border = '1px solid #ffae00';

    failedVinDecode = true;

    // Append the message to the VIN textbox container
    paintCodeWrapper.appendChild(vinMessage);
  }
}

async function decoderLoggerWebhook(state, plate, vin, site, year, make, model, styleId, code, error, partifyLocation, parentUrl, genericDesc, fullDescription, hex) {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwMc2VFphCTCLkGPdPWQ7IvBPOXFOqNIJOyNgGKiSOQzog5rLcvDyGT7VxcPw49L53T4Q/exec', {
      redirect: "follow",
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
      },
      body: JSON.stringify({
        state: state,
        plate: plate,
        vin: vin,
        site: site,
        year: year,
        make: make,
        model: model,
        styleId: styleId,
        code: code,
        error: error,
        themeName: themeName,
        partifyLocation: partifyLocation,
        parentUrl: parentUrl,
        genericDesc: genericDesc,
        fullDescription: fullDescription,
        hex: hex
      }),
    });

    // If the response is not JSON, log it as text to debug
    const text = await response.text();
    // Try parsing the JSON only if the response status is OK
    if (response.ok) {
      const result = JSON.parse(text);
      return result;
    } else {
      console.error('Server responded with an error:', text);
    }
  } catch (error) {
    console.error("Error submitting logs:", error);
  }
}

async function logGarageUsageToSheets(vin, plate, state, year, make, model, error, functionCall) {
  try {
    let partifyLocation = getPartifyLocation();

    const response = await fetch('https://script.google.com/macros/s/AKfycbwCZ8V4gzHelwgcdARADTgoze6bK-VKJYViFH2FgrrPslPZAaPdweVeVTgeWmEqgtOFgg/exec', {
      redirect: "follow",
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
      },
      body: JSON.stringify({
        vin: vin,
        plate: plate,
        state: state,
        year: year,
        make: make,
        model: model,
        error: error,
        themeName: themeName, // set globally
        partifyLocation: partifyLocation,
        functionCall: functionCall
      }),
    });

    // If the response is not JSON, log it as text to debug
    const text = await response.text();
    // Try parsing the JSON only if the response status is OK
    if (response.ok) {
      const result = JSON.parse(text);
      return result;
    } else {
      console.error('Server responded with an error:', text);
    }
  } catch (error) {
    console.error("Error submitting logs:", error);
  }
}

async function getPartifyLocation() {
  const ip = await getIpAddress();

  let partifyLocation = '';
  if (ip === "107.5.210.48") {
    partifyLocation = 'Warren';
  } else if (ip === "98.209.126.177" || ip === "68.34.24.103" || ip === "68.34.24.104") {
    partifyLocation = 'Fraser';
  }

  return partifyLocation;
}

function toggleProductDoesNotFitMsg(doesNotFit) {
  let vehicleList = document.querySelector('.vehicle-list');
  if (vehicleList) {
    let failToFitMsg = document.querySelector('.product-does-not-fit-garage-msg');
    if (!failToFitMsg) {
      failToFitMsg = document.createElement('div');
      failToFitMsg.className = 'product-does-not-fit-garage-msg';
      failToFitMsg.textContent = '';
      vehicleList.parentNode.insertBefore(failToFitMsg, vehicleList);
    }
    if (!doesNotFit) {
      failToFitMsg.style.display = 'none';
    } else {
      failToFitMsg.style.display = 'block';
    }
  }
}

function toggleGaragePopup() {
  // Always select the popup regardless of hidden state
  let garageEasyPopup = document.querySelector('.garage-easyYMM-popup');
  if (!garageEasyPopup) {
    console.error('No .garage-easyYMM-popup element found!');
    return;
  }

  const garagePopupStyleId = 'garage-popup-style';
  const scrollY = window.scrollY;

  garageEasyPopup.classList.toggle("hidden");

  if (!garageEasyPopup.classList.contains("hidden")) {
    document.body.dataset.scrollY = scrollY;

    if (!document.getElementById(garagePopupStyleId)) {
      const style = document.createElement('style');
      style.id = garagePopupStyleId;
      style.textContent = `
            body.no-scroll-garage-popup {
              position: fixed;
              top: -${scrollY}px;
              left: 0;
              width: 100%;
              height: 100%;
              overflow: hidden !important;
            }
          `;
      document.head.appendChild(style);
    }
    document.body.classList.add('no-scroll-garage-popup');
    hideShopifyChat();
  } else {
    const savedScrollY = parseInt(document.body.dataset.scrollY || '0', 10);
    delete document.body.dataset.scrollY;

    let terms = JSON.parse(localStorage.getItem('searchTerms')) || [];
    if (document.getElementById("add-vehicle-btn").style.display === "none" && terms.length > 0) {
      const garagePopupContainer = document.querySelector(".garage-easyYMM-popup-container");
      garagePopupContainer.querySelector(".easyYMM").style.display = "none";
      document.getElementById("vin-to-collection-placeholder").style.display = "none";
      document.getElementById("vin-to-collection-or").style.display = "none";
      if (garagePopupContainer) {
        garagePopupContainer.classList.remove('no-bottom-radius');
      }
      document.getElementById("add-vehicle-btn").style.display = "flex";
      document.querySelector(".garage-block").style.display = "block";
      document.querySelector(".select-your-vehicle-header").style.display = "none";
    }
    const style = document.getElementById(garagePopupStyleId);
    if (style) {
      style.remove();
    }

    window.scrollTo(0, savedScrollY);
    showShopifyChat();
  }
}

function generateCollectionHandle(vehicleData) {
  let collectionHandle = vehicleData
    .toLowerCase()
    .replace(/\./g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/-+$/, '');

  return collectionHandle;
}

function openQuestionModal({
  scrollLockClass = 'no-scroll-paint-swatch',
  accordionSelector = '.accordion-section',
  overlaySelector = '.product-unfolded-popup-dark-overlay',
  modalSelector = '.unfolded-popup-container',
  modalContentSelector = '.popup-modal-content',
  fetchContentFn = null // async function to fetch content, if needed
}) {
  // Save scroll position globally
  // window.paintModalScrollPosition = window.scrollY || document.documentElement.scrollTop;

  // Optionally expand accordions
  if (accordionSelector) {
    const accordionSections = document.querySelectorAll(accordionSelector);
    accordionSections.forEach(section => {
      const content = section.querySelector('.accordion-content');
      const circlePlus = section.querySelector('.circle_plus');
      const circleNone = section.querySelector('.circle_none');
      const isOpen = content.classList.contains('open');
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (!isOpen) {
            content.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';
            if (circlePlus) circlePlus.style.display = 'none';
            if (circleNone) circleNone.style.display = 'block';
          }
        }, 500);
      });
    });
  }

  // Lock scroll
  document.body.classList.add(scrollLockClass);

  // Hide Shopify chat
  if (typeof hideShopifyChat === 'function') hideShopifyChat();

  // Show overlay
  if (overlaySelector) {
    const overlay = document.querySelector(overlaySelector);
    if (overlay) overlay.style.display = 'block';
  }

  // Show modal and set content
  if (modalSelector) {
    document.querySelector(modalSelector).style.display = 'block';
  }
  if (fetchContentFn && modalContentSelector) {
    fetchContentFn().then(pageContent => {
      document.querySelector(modalContentSelector).innerHTML = pageContent;
    }).catch(error => {
      console.error('Error fetching modal content:', error);
    });
  }
}

function showQuestionModal(content, showContent, modalElement, containerElement) {
  const modalContent = document.querySelector(modalElement);
  if (showContent) {
    modalContent.innerHTML = content;
  }
  document.querySelector(containerElement).style.display = "block";
}

function closeQuestionModal(noScrollElement, scrollPosition, containerElement, modalElement, overlayElement) {
  // Remove scroll lock and restore scroll position
  document.body.classList.remove(noScrollElement);
  window.scrollTo(0, scrollPosition); // Restore scroll position

  // Show Shopify chat and hide overlay
  showShopifyChat();
  hideQuestionModalOverlay(overlayElement);
  hideQuestionModal(containerElement, modalElement);
}

function hideQuestionModal(containerElement, modalElement) {
  const container = document.querySelector(containerElement);
  const modal = document.querySelector(modalElement);
  const onAnimationEnd = function () {
    modal.style.animation = '';
    container.style.display = 'none';
    modal.removeEventListener('animationend', onAnimationEnd);
  };

  modal.style.animation = "drop-out 0.3s forwards";
  modal.addEventListener('animationend', onAnimationEnd);
}

function hideQuestionModalOverlay(overlayElement) {
  document.querySelector(overlayElement).style.display = "none";
}

function showQuestionModalOverlay(overlayElement) {
  document.querySelector(overlayElement).style.display = "block";
}

function accordionButtonHandle(button, section) {
  const accordionSection = button.closest(section);
  const content = accordionSection.querySelector('.accordion-content');
  const circlePlus = accordionSection.querySelector('.circle_plus');
  const circleNone = accordionSection.querySelector('.circle_none');

  // Check if the clicked accordion is already open
  const isOpen = content.classList.contains('open');

  if (isOpen) {
    // Open the clicked accordion
    content.classList.remove('open');
    content.style.maxHeight = 0;

    // Show the minus icon and hide the plus icon for the active accordion
    circlePlus.style.display = 'block';
    circleNone.style.display = 'none';
  }

  if (!isOpen) {
    // Open the clicked accordion
    content.classList.add('open');
    content.style.maxHeight = content.scrollHeight + "px";

    // Show the minus icon and hide the plus icon for the active accordion
    circlePlus.style.display = 'none';
    circleNone.style.display = 'block';
  }
}

function hideShopifyChat() {
  const shopifyChat = document.getElementById('shopify-chat');
  if (shopifyChat) {
    shopifyChat.style.display = 'none';
  }
}

// Function to show Shopify chat widget
function showShopifyChat() {
  const shopifyChat = document.getElementById('shopify-chat');
  if (shopifyChat) {
    shopifyChat.style.display = 'block';
  }
}

async function fetchVehicalDataFromBumper(vin) {
  try {
    const response = await fetch(`https://bumperdotcom-api-345230973812.us-east5.run.app/bumperdotcom-api?vin=${vin}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });


    data = await response.json();

    if (!response.ok) {
      throw new Error(`Error fetching order details. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
  }
}