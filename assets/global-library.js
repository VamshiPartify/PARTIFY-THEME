/*******************************************************************************************************
**                                                                                                    **
**                                             VARIABLES                                              **
**                                                                                                    **
*******************************************************************************************************/

let attemptedVinsInGarage = [];
let attemptedVinsVinVerification = [];
let garageVinSubmissionBool = false;
let finalVinVerificationSubmissionVin = '';
let successfulVinVerificationVin = false;
let themeName = '';
let alreadyLogged = false;






/*******************************************************************************************************
**                                                                                                    **
**                                             UTILITIES                                              **
**                                                                                                    **
*******************************************************************************************************/

const getIpAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip; // Returns the client's public IP
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return null;
  }
};

// Function to update garage and navigate
async function updateGarageAndNavigate(handle, vin) {
  const redirectUrl = `/collections/${handle}${vin ? `?vin=${encodeURIComponent(vin)}` : ''}`;
  window.location.href = redirectUrl;
}

/*
    functionLocation - 1 = Garage
    functionLocation - 2 = Vin Verification
*/
// Function to handle VIN change
const handleVinChange = (event, functionLocation, errorMsg) => {
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
  }
};

const handleLicenseChange = (event, functionLocation, errorMsg) => {
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
*/
async function fetchVehicleDataByVin(vin, functionLocation, noResults, failed3times, searchBtn, tailoredSuccessMessage, remainingAttempts) {
  const vinSearchBtn = document.getElementById("vin-to-collection-btn");
  const errorMessageVIN = document.querySelector('.errorMessageVIN');
  const maxAttempts = 3;
  const calculatedRemainingAttempts = maxAttempts - attemptedVinsVinVerification.length;
  const vinGuaranteeFetchingMsg = document.querySelector('.vin-verification-fetching-vin-data');

  console.log('fetchVehicleDataByVin::vin: ', vin);

  try {
    if (vinGuaranteeFetchingMsg) vinGuaranteeFetchingMsg.style.display = "block";
    const response = await fetch('https://garage-vin-service-node-740168228309.us-east5.run.app/fetchVehicleData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vin: vin,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching order details. Status: ${response.status}. Message: ${response.statusText}.`);
    }
    const data = await response.json();

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
        updateGarageAndNavigate(data.handle, vin);
      }
    } else if (functionLocation === 2) {
      if (data.handle === '' || data.isVinValid === false) {
        if (attemptedVinsVinVerification.length < maxAttempts) {

          document.querySelector('.vin-verification-submission-failed-message').innerHTML = noResults;
          document.querySelector('.vin-verification-remaining-attempts').style.display = "block";
          document.querySelector('.vin-verification-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttempts;
        } else {
          document.querySelector('.vin-verification-submission-failed-message').innerHTML = failed3times;
          // document.getElementById('vin-textbox-for-verification').value = '';
          // document.getElementById('vin-textbox-for-verification').disabled = true;
          document.querySelector('.vin-verification-remaining-attempts').style.display = "block";
          document.querySelector('.vin-verification-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttempts;
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
    }
  } catch (error) {
    console.log('attemptedVinsVinVerification: ', attemptedVinsVinVerification);
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
      if (attemptedVinsVinVerification.length < maxAttempts) {
        document.querySelector('.vin-verification-submission-failed-message').innerHTML = noResults;
        document.querySelector('.vin-verification-remaining-attempts').style.display = "block";
        document.querySelector('.vin-verification-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttempts;
      } else {
        document.querySelector('.vin-verification-submission-failed-message').innerHTML = failed3times;
        document.getElementById('vin-textbox-for-verification').disabled = true;
        document.querySelector('.vin-verification-remaining-attempts').style.display = "block";
        document.querySelector('.vin-verification-remaining-attempts').innerHTML = remainingAttempts + calculatedRemainingAttempts;
        finalVinVerificationSubmissionVin = vin;
      }
      document.querySelector('.vin-verification-submission-success-message').style.display = "none";
      document.querySelector('.vin-verification-submission-failed-message').style.display = "block";
      console.error("Error fetching vehicle data:", error);
      return false;
    }
    console.error("Error fetching vehicle data:", error);
  } finally {
    if (vinGuaranteeFetchingMsg) vinGuaranteeFetchingMsg.style.display = "none";

    if (functionLocation === 1) {
      vinSearchBtn.classList.remove("vin-to-collection-btn--loading");
      vinSearchBtn.innerHTML = searchBtn;
    }
  }
}

async function fetchBumpersLicenseToVin(state, plate) {
  try {
    alreadyLogged = false;
    console.log('Fetching vehicle data by license plate...');
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

    const response = await fetch('https://script.google.com/macros/s/AKfycbwwElW_l2cKNTPAbkO69DwTL-C-3a9kj1sKaINLT5BpJV8V3CoOlcEtSrB-yivkSA-Ang/exec', {
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