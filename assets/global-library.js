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






/*******************************************************************************************************
**                                                                                                    **
**                                             UTILITIES                                              **
**                                                                                                    **
*******************************************************************************************************/

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
          document.querySelector('.errorMessage').style.visibility = 'visible';
          document.querySelector('.errorMessage').innerHTML = 'VIN already searched. Please try a different VIN';
          document.getElementById('vin-to-collection-btn').disabled = true;
          return;
        } else {
          document.querySelector('.errorMessage').style.visibility = 'hidden';
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
async function fetchVehicalDataByVin(vin, functionLocation, noResults, failed3times, searchBtn, tailoredSuccessMessage, remainingAttempts) {
  const vinSearchBtn = document.getElementById("vin-to-collection-btn");
  const errorMessage = document.querySelector('.errorMessage');
  const maxAttempts = 3;
  const calculatedRemainingAttempts = maxAttempts - attemptedVinsVinVerification.length;
  const vinGuaranteeFetchingMsg = document.querySelector('.vin-verification-fetching-vin-data');

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
    console.log('data.handle: ', data);

    if (functionLocation === 1) {
      // NOTE: The data returns the paint code here! No need to alter gcr function as I can 
      // just use the paint code from the data object here.
      if (data.handle === '') {
        if (attemptedVinsInGarage.length < maxAttempts) {
          document.querySelector('.errorMessage').innerHTML = noResults;
        } else {
          document.querySelector('.errorMessage').innerHTML = failed3times;
          document.getElementById('vin').disabled = true;
          return;
        }
        garageVinSubmissionBool = false;
        return;
      } else {
        // Don't add garageVinSubmissionBool here because there will be a time when the button
        // is clickable between submission and page navigation.  Don't wan't anyone spamming
        // the button.
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
      if (errorMessage.style.visibility === 'hidden') {
        errorMessage.style.visibility = 'visible';
      }
      vinSearchBtn.disabled = true;
      if (attemptedVinsInGarage.length < maxAttempts) {
        document.querySelector('.errorMessage').innerHTML = noResults;
      } else {
        document.querySelector('.errorMessage').innerHTML = failed3times;
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