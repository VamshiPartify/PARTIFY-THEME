/*******************************************************************************************************
**                                                                                                    **
**                                             VARIABLES                                              **
**                                                                                                    **
*******************************************************************************************************/

let attemptedVinsInGarage = [];
let attemptedVinsVinVerification = [];
let attemptedVinsOEM = [];
let attemptedOEMVins = [];
let attemptedDecodedVins = [];
let garageVinSubmissionBool = false;
let finalVinVerificationSubmissionVin = '';
let successfulVinVerificationVin = false;
let successfulVinDecoding = false;
let themeName = '';
let alreadyLogged = false;
let garageToCollections = false;
let garageFirstVehicleData = '';






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
          engine ?? null
        );
      });
    }
  });
}


// --- GarageUtils: getSearchTerms and setSearchTerms helpers (migrated from garage-script.liquid) ---
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
    };
  });
  localStorage.setItem('searchTerms', JSON.stringify(terms));
  return terms;
}

// --- moveVehicleToFront migrated from garage-script.liquid ---
function moveVehicleToFront(vehicleData) {
  let currentSearchTerms = getSearchTerms();
  // vehicleData can be a string (ymm) or an object
  let ymm = typeof vehicleData === 'string' ? vehicleData : vehicleData.ymm;
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
      } // else keep as is (already longer)
    }
  } else {
    vehicleObj =
      typeof vehicleData === 'object'
        ? vehicleData
        : { ymm, vin: null, paintCode: null, year: null, make: null, model: null, submodel: null, engine: null };
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
  if (!select) return;
  const start = Date.now();
  return new Promise((resolve) => {
    function trySet() {
      // Option is present and value is not already set
      if (Array.from(select.options).some(opt => opt.value == value)) {
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        resolve();
      } else if (Date.now() - start > timeout) {
        resolve(); // Give up after timeout
      } else {
        setTimeout(trySet, 50);
      }
    }
    trySet();
  });
}

function setFitmentObjectGlobal(obj) {
  localStorage.setItem('easysearch-preselect-fitment', JSON.stringify(obj));
  localStorage.setItem('easysearch-preselect', JSON.stringify(obj));
}

function updateEasysearchLocalStorageOrNavigate(year, make, model, submodel, engine) {
  let anchor = null;
  const holder = document.querySelector('.easysearch-holder');
  const actionsHolder = holder.querySelector('.easysearch-actions-holder');
  if (actionsHolder) {
    const btnHolder = actionsHolder.querySelector('.easysearch-btn-holder');
    if (btnHolder) {
      anchor = btnHolder.querySelector('a');
    }
  }

  const fields = [year, make, model, submodel, engine];
  // Build ymm string and searchTerm object
  const yearVal = year && year.value ? year.value.trim() : '';
  const makeVal = make && make.value ? make.value.trim() : '';
  const modelVal = model && model.value ? model.value.trim() : '';
  const submodelVal = submodel && submodel.value ? submodel.value.trim() : '';
  const engineVal = engine && engine.value ? engine.value.trim() : '';
  const ymm = [yearVal, makeVal, modelVal, submodelVal, engineVal].filter(Boolean).join(' ');


  // If on the product page, set fitment values and do not redirect
  // If on product page and the Easysearch Change Vehicle was clicked (not the garage btn)
  if (window.location.pathname.includes('/products/')) {
    updateLocalStorageValues(ymm, yearVal, makeVal, modelVal, submodelVal, engineVal, fields, anchor);
  } else {
    updateSearchTerms(ymm, yearVal, makeVal, modelVal, submodelVal, engineVal);
    window.location.href = anchor.href;
  }
}

function updateLocalStorageValues(ymm, yearVal, makeVal, modelVal, submodelVal, engineVal, fields, anchor) {
  let fitmentValue = '';
  const easySearchBtnSearch = document.querySelector('.easysearch-btn-search');
  let expires = Date.now() + 365 * 24 * 60 * 60 * 1000;
  fitmentValue = fields
    .filter(f => f && f.value)
    .map(f => f.value + 'easysearch-preselect-delimiter')
    .join('');
  const fitmentObject = {
    value: fitmentValue,
    expires: expires.toString(),
  }
  setFitmentObjectGlobal(fitmentObject);

  updateSearchTerms(ymm, yearVal, makeVal, modelVal, submodelVal, engineVal);

  // Save current search parameters to localStorage or backend
  easysearch.saveSearchParams(easySearchBtnSearch);
  easysearch.addPropertyToProductForm();
  // Get the fitment widget element and the URL to load fitment results
  const fitWidget = document.querySelector('.easysearch-fitment-widget');
  const fitmentUrl = anchor.href;

  // Function to trigger the fitment widget toggle after EasySearch is ready
  function triggerFitmentWidget() {
    // Only proceed if easysearch and fitmentToggleWidget are available, and required elements exist
    if (window.easysearch && typeof easysearch.fitmentToggleWidget === 'function' && fitWidget && fitmentUrl) {
      // Show or update the fitment widget with the selected fitment URL
      easysearch.fitmentToggleWidget(fitWidget, fitmentUrl);
      // Remove the event listener after firing to avoid duplicate calls
      document.removeEventListener('easysearch_init_native_search_page', triggerFitmentWidget);
    }
  }

  // Listen for the EasySearch ready event, then trigger the fitment widget
  document.addEventListener('easysearch_init_native_search_page', triggerFitmentWidget);

  // If EasySearch is already loaded, call the fitment widget toggle immediately
  if (window.easysearch && typeof easysearch.fitmentToggleWidget === 'function') {
    easysearch.fitmentToggleWidget(fitWidget, fitmentUrl);
  }

  // Open the garage popup (likely a UI overlay for saved vehicles)
  toggleGaragePopup();
  // Hidden El
  const hiddenEasysearchEl = document.querySelector('.easysearch-fitment-search-widget');
  const failOrSuccessEasysearchEl = document.querySelector('.easysearch-fitment-holder');
  // need to check if the hiddenEasysearchEl class contains the 'easysearch-hidden' class
  if (hiddenEasysearchEl && !hiddenEasysearchEl.classList.contains('easysearch-hidden')) {
    hiddenEasysearchEl.classList.add('easysearch-hidden');
  }
  if (failOrSuccessEasysearchEl && failOrSuccessEasysearchEl.classList.contains('easysearch-hidden')) {
    failOrSuccessEasysearchEl.classList.remove('easysearch-hidden');
  }
}

function updateSearchTerms(ymm, yearVal, makeVal, modelVal, submodelVal, engineVal) {
  // Custom deduplication and update logic
  let searchTerms = getSearchTerms();
  let foundIdx = searchTerms.findIndex(term =>
    term.year === yearVal &&
    term.make === makeVal &&
    term.model === modelVal
  );
  if (ymm && foundIdx > -1) {
    // Found a match on year, make, model
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
        vin: null,
        paintCode: null,
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
  } else if (ymm) {
    // No match on year, make, model, so add new
    const newTerm = {
      ymm: ymm,
      vin: null,
      paintCode: null,
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

async function updateGarageAndNavigate(year, make, model, submodel, engine, vin) {
  await setSelectValueWhenReady('easysearch_field_4973', year || '');
  await setSelectValueWhenReady('easysearch_field_4974', make || '');
  await setSelectValueWhenReady('easysearch_field_4975', model || '');
  await setSelectValueWhenReady('easysearch_field_28136', submodel || '');
  await setSelectValueWhenReady('easysearch_field_28137', engine || '');


  let formattedYmm = '';
  if (submodel && engine) {
    formattedYmm = `${year} ${make} ${model} ${submodel || ''} ${engine || ''}`;
  } else if (submodel && !engine) {
    formattedYmm = `${year} ${make} ${model} ${submodel || ''}`;
  } else {
    formattedYmm = `${year} ${make} ${model}`;
  }

  moveVehicleToFront({
    ymm: formattedYmm,
    vin: vin || null,
    paintCode: null,
    year: year || null,
    make: make || null,
    model: model || null,
    submodel: submodel || null,
    engine: engine || null,
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
    // toggleGaragePopup();
    updateEasysearchLocalStorageOrNavigate(year, make, model, submodel, engine);
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
async function updateGarageAndNavigate(handle, vin, ymm) {
  let currentSearchTerms = getGarageSearchTerms();
  const vehicleIndex = currentSearchTerms.findIndex((obj) => obj.ymm === ymm);
  let vehicleObj = vehicleIndex > -1 ? currentSearchTerms[vehicleIndex] : null;

  // Only if the vehicle exists already, insert a VIN if it is not already present
  if (vehicleObj) {
    if (!currentSearchTerms[vehicleIndex].vin) {
      currentSearchTerms[vehicleIndex].vin = vin; // Update the vin in the existing object
      localStorage.setItem('searchTerms', JSON.stringify(currentSearchTerms));
    }
  }
  const redirectUrl = `/collections/${handle}${vin ? `?vin=${encodeURIComponent(vin)}` : ''}`;
  window.location.href = redirectUrl;
}

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
          console.log('wool are we in here?');
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

function handleLicenseChange(event, functionLocation, errorMsg) {
  let licenseInput = event.target.value.toUpperCase();
  event.target.value = licenseInput;
  const licenseBtn = document.getElementById('license-to-vin-btn');
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
    console.log('data: ', data);
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
  }
}

/*
    functionLocation - 1 = Garage
    functionLocation - 2 = Vin Verification
    functionLocation - 3 = Vin Decoder
    functionLocation - 4 = OEM
*/
async function fetchVehicalDataByVin(vin, functionLocation, noResults, failed3times, searchBtn, tailoredSuccessMessage, remainingAttempts, troublesomeMakesColors, bumperdotcommake) {
  const vinSearchBtn = document.getElementById("vin-to-collection-btn");
  const errorMessageVIN = document.querySelector('.errorMessageVIN');
  const maxAttempts = 3;
  let calculatedRemainingAttemptsVinVerification = maxAttempts - attemptedVinsVinVerification.length;
  let calculatedRemainingAttemptsVinDecoder = maxAttempts - attemptedDecodedVins.length;
  const vinGuaranteeFetchingMsg = document.querySelector('.vin-verification-fetching-vin-data');
  const vinDecoderFetchingMsg = document.querySelector('.vin-decoder-fetching-vin-data');

  try {
    if (vinGuaranteeFetchingMsg) vinGuaranteeFetchingMsg.style.display = "block";
    if (vinDecoderFetchingMsg) vinDecoderFetchingMsg.style.display = "block";
    let response = "";
    let data = "";
    let dataResult = "";
    let description = "";
    let vehicleError = false;
    let validVin = false;
    let exteriorColors = [];
    let colorCode = "";
    let year = '';
    let make = '';
    let model = '';
    let ymm = '';

    console.log("bumperdotcommake: ", bumperdotcommake);
    if (bumperdotcommake && bumperdotcommake === true) {
      response = await fetch(`https://bumperdotcom-api-345230973812.us-east5.run.app/bumperdotcom-api?vin=${vin}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      data = await response.json();

      if (!response.ok) {
        validVin = false;
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
            console.log('colorCode: ', colorCode);
            exteriorCounter++;
          }
        })
      }
      year = data.entities.vehicles.automobiles[0]?.year || '';
      make = data.entities.vehicles.automobiles[0]?.make || '';
      model = data.entities.vehicles.automobiles[0]?.model || '';
      ymm = `${year} ${make} ${model}`.trim();
      console.log('data from bumper.com: ', data);
    } else {
      response = await fetch('https://garage-vin-service-node-740168228309.us-east5.run.app/fetchVehicleData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vin: vin,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching order details. Status: ${response.status}. Message: ${response.statusText}.`);
      }
      data = await response.json();
      if (data.vehicleData.message === "The VIN passed was modified to convert invalid characters") {
        validVin = false;
      }
      if (!response.ok) {
        if (data.vehicleData.message === "Invalid vin") {
          validVin = false;
        }
        throw new Error(`API request failed with status ${response.status} - ${data.message} | ${response.url}`);
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

      if (exteriorColors.length === 1) {
        colorCode = exteriorColors[0]?.colorCode || '';
      }
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
        // is clickable between submission and page navigation.  Don't wan't anyone spamming
        // the button.
        if (!alreadyLogged) {
          logGarageUsageToSheets(vin, '', '', data.year, data.make, data.model, '', 'Garage VIN Submission');
        } else {
          // If already logged, reset the flag so it can be logged again if needed.
          alreadyLogged = false;
        }
        updateGarageAndNavigate(data.year, data.make, data.model, data.submodel, data.engine, vin);
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
      if (attemptedDecodedVins.length < maxAttempts) {
        attemptedDecodedVins.push(vin);
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
            return { validVin: true, ymm: ymm, paintCode: matchedKey ? troublesomeMakesColors[matchedKey] : '' };
          } else {
            successfulVinDecoding = true;
            return { validVin: true, ymm: ymm, paintCode: colorCode || '' };
          }
        } else {
          document.querySelector('.vin-decoder-submission-failed-message').innerHTML = noResults;
          document.querySelector('.vin-decoder-remaining-attempts').style.display = "block";
          document.querySelector('.vin-decoder-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttemptsVinDecoder;
          return { validVin: false, ymm: '', paintCode: '' };
        }
      } else {
        document.querySelector('.vin-decoder-submission-failed-message').innerHTML = failed3timesMsg;
        document.querySelector('.vin-decoder-submission-failed-message').style.display = "block";
        document.querySelector('.vin-decoder-remaining-attempts').style.display = "block";
        document.querySelector('.vin-decoder-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttemptsVinDecoder;
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
      if (attemptedDecodedVins.length < maxAttempts) {
        document.querySelector('.vin-decoder-submission-failed-message').innerHTML = noResults;
        document.querySelector('.vin-decoder-remaining-attempts').style.display = "block";
        document.querySelector('.vin-decoder-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttemptsVinDecoder;
      } else {
        document.querySelector('.vin-decoder-submission-failed-message').innerHTML = failed3times;
        document.querySelector('.vin-decoder-submission-failed-message').style.display = "block";
        document.querySelector('.vin-decoder-remaining-attempts').style.display = "none";
        document.querySelector('.vin-decoder-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttemptsVinDecoder;
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
  }
}

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

async function logGarageUsageToSheets(vin, plate, state, year, make, model, error, functionCall) {
  try {
    const ip = await getIpAddress();
    let partifyLocation = '';
    if (ip === "107.5.210.48") {
      partifyLocation = 'Warren';
    } else if (ip === "98.209.126.177" || ip === "68.34.24.103" || ip === "68.34.24.104") {
      partifyLocation = 'Fraser';
    }

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
    console.log('data from bumper.com: ', data);

    if (!response.ok) {
      throw new Error(`Error fetching order details. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
  }
}