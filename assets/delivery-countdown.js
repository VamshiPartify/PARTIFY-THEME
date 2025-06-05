function deliveryCountdown(store_id, item_sku) {
	if ((store_id != '') && (typeof store_id != 'undefined'))
		asm_store_id = store_id.replace('.myshopify.com', '');

	if ((item_sku != '') && (typeof item_sku != 'undefined'))
		asm_item_sku = item_sku;

	if ((asm_store_id != '') && (asm_item_sku != '')) {
		clearTimeout(asm_timeout);

		var jsel = document.createElement('SCRIPT');
		jsel.type = 'text/javascript';
		jsel.src = 'https://www.advancedshippingmanager.com/clients/delivery_countdown/delivery_countdown.php?si=' + asm_store_id + '&is=' + asm_item_sku;
		document.getElementById('asm-ajax').appendChild(jsel);
	} else {
		asm_timeout = setTimeout('deliveryCountdown()', 100);
	}
}

function activate_enter(evt) {
	evt = (evt) ? evt : event;
	var charCode = (evt.charCode) ? evt.charCode :
		((evt.which) ? evt.which : evt.keyCode);
	if (charCode == 13) {
		deliveryRecalc(1);
		//		ValidateShippingCalc();
		return false;
	} else {
		return true;
	}
}

function deliveryRecalc(relocation) {
	let applyButton = document.getElementById('dc-alt-zip-apply-partify');

	if (document.getElementById('dc-alt-country-partify'))
		asm_country_code = document.getElementById('dc-alt-country-partify').value;

	if (document.getElementById('dc-alt-zip-partify')) {
		asm_zip_code = document.getElementById('dc-alt-zip-partify').value;

		clearInterval(x_interval);

		if (applyButton) {
			applyButton.classList.add('vin-to-collection-btn--loading'); // Add spinner class
			applyButton.innerHTML = ''; // Clear text to only show spinner

			applyButton.style.display = 'flex';
			applyButton.style.justifyContent = 'center';
			applyButton.style.alignItems = 'center';

			applyButton.disabled = true; // Disable button
		}

		asmDataBackup = structuredClone(window.asmData);

		Object.keys(window.asmData).forEach(key => delete window.asmData[key]);

		queryAllETAs(qualitySelectedType, relocation);

		clearTimeout(applyButtonTimeout);

		applyButtonTimeout = setTimeout(function () {
			const zipHolder = document.getElementById('dc-alt-zip-holder-partify');
			if (zipHolder && zipHolder.style.display === 'block') {
				zipHolder.style.display = 'none';
				document.body.classList.remove('delivery-popup-no-scroll');
			}

			// Restore the button text and state after 5 seconds
			if (applyButton) {
				applyButton.classList.remove('vin-to-collection-btn--loading'); // Remove spinner class
				applyButton.innerHTML = apply; // Restore button text

				applyButton.style.display = '';
				applyButton.style.justifyContent = '';
				applyButton.style.alignItems = '';

				applyButton.disabled = false; // Enable button
			}
		}, 5000);
	}
}


function qualityVariantRecalc(quality, variant, sku) {
	if (asm_item_sku === '') {
		asm_item_sku = sku;
	}

	if ((quality !== '') && (typeof quality !== 'undefined')) {
		baseSku = asm_item_sku;
		if (quality === 'oem') {
			baseSku = baseSku.replace(/OE$/, '').replace(/C$/, ''); // Remove OE or C only if it's at the end -- the $ signifies the end of a string
			qualitySku = baseSku + "OE";
		} else if (quality === 'capa') {
			baseSku = baseSku.replace(/OE$/, '').replace(/C$/, '');
			qualitySku = baseSku + "C";
		} else {
			baseSku = baseSku.replace(/OE$/, '').replace(/C$/, '');
			qualitySku = baseSku;
		}
		variantSku = qualitySku;

	}


	if ((variant !== '') && (typeof variant !== 'undefined')) {
		if (variant === "Unpainted") {
			variantSku = qualitySku;
		} else {
			variantSku = qualitySku + "." + variant;
		}
	}

	// preloadASMData([variantSku]);
	return variantSku;
}

// Override setCountdownTime to capture the data
// This function intercepts the ASM script to set the countdown time
window.setCountdownTime = function (time) {
	const lastScript = document.currentScript; // Get the current script executing
	if (lastScript) {
		let variantSku = lastScript.getAttribute('data-sku');
		if (variantSku.includes("Default")) {
			variantSku = variantSku.split('.')[0];
		}
		if (variantSku) {
			if (!window.asmData[variantSku]) window.asmData[variantSku] = {};
			window.asmData[variantSku].countdownTime = time;
		}
	}
};

// Override setGeoValues to capture the data
// This function intercepts the ASM script to set the geo values
window.setGeoValues = function (city, state, zip, country) {
	const lastScript = document.currentScript; // Get the current script executing
	baseZipForRevert = zip;

	if (lastScript) {
		let variantSku = lastScript.getAttribute('data-sku');
		if (variantSku.includes("Default")) {
			variantSku = variantSku.split('.')[0];
		}
		if (variantSku) {

			if (!window.asmData[variantSku]) window.asmData[variantSku] = {};
			window.asmData[variantSku].geo = { city, state, zip, country };
		}
	}
};

// Override setZipValue to capture the data
// This function intercepts the ASM script to set the zip value
window.setZipValue = function (zip) {
	const lastScript = document.currentScript; // Get the current script executing
	if (lastScript) {
		let variantSku = lastScript.getAttribute('data-sku');
		if (variantSku.includes("Default")) {
			variantSku = variantSku.split('.')[0];
		}
		if (variantSku) {
			if (!window.asmData[variantSku]) window.asmData[variantSku] = {};
			window.asmData[variantSku].geo = { zip };
		}
	}
};

function loadASMDataAsync(variantSku) {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = `https://www.advancedshippingmanager.com/clients/delivery_countdown/delivery_countdown.php?si=${asm_store_id}&is=${variantSku}`;
		script.setAttribute('data-sku', variantSku);
		script.style.display = 'none';

		script.onload = () => resolve(variantSku); // Resolve when script loads
		script.onerror = () => reject(`Failed to load ${variantSku}`); // Reject on error

		document.body.appendChild(script);
	});
}

function loadASMDataAsyncRelocation(variantSku) {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://www.advancedshippingmanager.com/clients/delivery_countdown/delivery_countdown.php?si=' + asm_store_id + '&is=' + variantSku + '&zc=' + asm_zip_code + '&cc=' + asm_country_code + '&variant=' + asm_variant;
		script.setAttribute('data-sku', variantSku);
		script.style.display = 'none';

		script.onload = () => resolve(variantSku); // Resolve when script loads
		script.onerror = () => reject(`Failed to load ${variantSku}`); // Reject on error

		document.body.appendChild(script);
	});
}


function preloadASMData(possibleVariantSkus, duplicateETAArr, baseModelSku, relocation) {

	if (relocation === 1 || relocation === 2) {
		Promise.all(possibleVariantSkus.map(loadASMDataAsyncRelocation))
			.then(() => {
				const roleModelSku = baseModelSku || possibleVariantSkus[1];
				duplicateETAArr.forEach((variantSku) => {
					if (!window.asmData[variantSku]) {
						window.asmData[variantSku] = window.asmData[roleModelSku]; // Copy data from the first variant
					}
				})
			})
			.catch(error => console.error("Error loading ASM scripts:", error));
	} else {
		// Load all scripts and wait for them all to finish
		Promise.all(possibleVariantSkus.map(loadASMDataAsync))
			.then(() => {
				const roleModelSku = baseModelSku || possibleVariantSkus[1];
				duplicateETAArr.forEach((variantSku) => {
					if (!window.asmData[variantSku]) {
						window.asmData[variantSku] = window.asmData[roleModelSku]; // Copy data from the first variant
					}
				})
			})
			.catch(error => console.error("Error loading ASM scripts:", error));
	}
}



function loadASMData(variantSku) {
	const asmContainer = document.getElementById('asm-ajax');

	if (window.asmCache[variantSku]) {
		asmContainer.innerHTML = ""; // Clear previous script
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.textContent = window.asmCache[variantSku]; // Use preloaded data
		asmContainer.appendChild(script);
	} else {
		asmContainer.innerHTML = ""; // Clear previous script
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = `https://www.advancedshippingmanager.com/clients/delivery_countdown/delivery_countdown.php?si=${asm_store_id}&is=${variantSku}`;
		asmContainer.appendChild(script);
	}
}


function getCountdownTime(target_date) {
	clearInterval(x_interval);

	if (target_date) {
		var countDownDate = new Date(target_date);
		var countDownTime = countDownDate.getTime();

		var defined_weekday = new Array();

		defined_weekday[0] = shopLocale === 'en' ? 'Sunday' : 'Domingo';
		defined_weekday[1] = shopLocale === 'en' ? 'Monday' : 'Lunes';
		defined_weekday[2] = shopLocale === 'en' ? 'Tuesday' : 'Martes';
		defined_weekday[3] = shopLocale === 'en' ? 'Wednesday' : 'Miércoles';
		defined_weekday[4] = shopLocale === 'en' ? 'Thursday' : 'Jueves';
		defined_weekday[5] = shopLocale === 'en' ? 'Friday' : 'Viernes';
		defined_weekday[6] = shopLocale === 'en' ? 'Saturday' : 'Sábado';

		var defined_months = new Array();
		defined_months[0] = shopLocale === 'en' ? 'January' : 'Enero';
		defined_months[1] = shopLocale === 'en' ? 'February' : 'Febrero';
		defined_months[2] = shopLocale === 'en' ? 'March' : 'Marzo';
		defined_months[3] = shopLocale === 'en' ? 'April' : 'Abril';
		defined_months[4] = shopLocale === 'en' ? 'May' : 'Mayo';
		defined_months[5] = shopLocale === 'en' ? 'June' : 'Junio';
		defined_months[6] = shopLocale === 'en' ? 'July' : 'Julio';
		defined_months[7] = shopLocale === 'en' ? 'August' : 'Agosto';
		defined_months[8] = shopLocale === 'en' ? 'September' : 'Septiembre';
		defined_months[9] = shopLocale === 'en' ? 'October' : 'Octubre';
		defined_months[10] = shopLocale === 'en' ? 'November' : 'Noviembre';
		defined_months[11] = shopLocale === 'en' ? 'December' : 'Diciembre';

		var defined_months_short = new Array();
		defined_months_short[0] = shopLocale === 'en' ? 'Jan' : 'Ene';
		defined_months_short[1] = shopLocale === 'en' ? 'Feb' : 'Feb';
		defined_months_short[2] = shopLocale === 'en' ? 'Mar' : 'Mar';
		defined_months_short[3] = shopLocale === 'en' ? 'Apr' : 'Abr';
		defined_months_short[4] = shopLocale === 'en' ? 'May' : 'Mayo';
		defined_months_short[5] = shopLocale === 'en' ? 'Jun' : 'Jun';
		defined_months_short[6] = shopLocale === 'en' ? 'Jul' : 'Jul';
		defined_months_short[7] = shopLocale === 'en' ? 'Aug' : 'Ago';
		defined_months_short[8] = shopLocale === 'en' ? 'Sep' : 'Sep';
		defined_months_short[9] = shopLocale === 'en' ? 'Oct' : 'Oct';
		defined_months_short[10] = shopLocale === 'en' ? 'Nov' : 'Nov';
		defined_months_short[11] = shopLocale === 'en' ? 'Dec' : 'Dic';

		if (document.getElementById('dc-weekday-partify'))
			document.getElementById('dc-weekday-partify').innerHTML = defined_weekday[countDownDate.getDay()];

		if (document.getElementById('dc-month-partify'))
			document.getElementById('dc-month-partify').innerHTML = defined_months[countDownDate.getMonth()];

		if (document.getElementById('dc-month-short-partify'))
			document.getElementById('dc-month-short-partify').innerHTML = defined_months_short[countDownDate.getMonth()];

		if (document.getElementById('dc-day-partify'))
			document.getElementById('dc-day-partify').innerHTML = countDownDate.getDate();

		x_interval = setInterval(function () {
			var now = new Date().getTime();

			var distance = countDownTime - now;

			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

			if (document.getElementById('dc-hours-partify')) {
				document.getElementById('dc-hours-partify').innerHTML = hours;
			}

			if (document.getElementById('dc-minutes-partify')) {
				document.getElementById('dc-minutes-partify').innerHTML = minutes;
			}

			if (distance < 0) {
				clearInterval(x_interval);
				if (qualitySelectedType) {
					deliveryRecalc(2);
				} else {
					if (document.getElementById('delivery-countdown-placeholder')) {
						document.getElementById('delivery-countdown-placeholder').style.display = 'flex';
					}
				}
			}
		}, 1000);

		if (document.getElementById('delivery-countdown-placeholder')) {
			document.getElementById('delivery-countdown-placeholder').style.display = 'none';
		}
		if (document.getElementById('delivery-countdown-partify'))
			document.getElementById('delivery-countdown-partify').style.display = 'block';
	}
}

function getGeoValues(city, state, zip, country) {
	if (document.getElementById('dc-city-partify')) {
		if (city === "N/A") {
			document.getElementById('dc-city-partify').innerHTML = '';
		} else {
			document.getElementById('dc-city-partify').innerHTML = ' ' + city;
		}
	}

	if (document.getElementById('dc-state-partify')) {
		if (state === "N/A") {
			document.getElementById('dc-state-partify').innerHTML = '';
		} else {
			document.getElementById('dc-state-partify').innerHTML = ' ' + state;
		}
	}

	if (document.getElementById('dc-zip-partify'))
		document.getElementById('dc-zip-partify').innerHTML = zip;

	if (document.getElementById('dc-alt-zip-partify'))
		document.getElementById('dc-alt-zip-partify').value = zip;

	if (document.getElementById('dc-country-partify'))
		document.getElementById('dc-country-partify').innerHTML = country;

	if (document.getElementById('dc-alt-country-partify'))
		document.getElementById('dc-alt-country-partify').value = country;


	if (document.getElementById('delivery-countdown-placeholder')) {
		document.getElementById('delivery-countdown-placeholder').style.display = 'none';
	}
	if (document.getElementById('delivery-countdown-partify'))
		document.getElementById('delivery-countdown-partify').style.display = 'block';
}

window.getZipValue = function (zip) {
	if (asm_variant == false)
		toggleZipInput();

	if (document.getElementById('dc-alt-zip-apply-partify'))
		document.getElementById('dc-alt-zip-apply-partify').innerHTML = '';

	if (document.getElementById('dc-zip-partify'))
		document.getElementById('dc-zip-partify').innerHTML = zip;

	if (document.getElementById('dc-alt-zip-partify'))
		document.getElementById('dc-alt-zip-partify').value = zip;
}

function toggleZipInput() {
	if (document.getElementById('dc-alt-zip-holder-partify')) {
		if (document.getElementById('dc-alt-zip-holder-partify').style.display != 'block') {
			document.getElementById('dc-alt-zip-holder-partify').style.display = 'block';
			document.body.classList.add('delivery-popup-no-scroll');
		} else {
			document.getElementById('dc-alt-zip-holder-partify').style.display = 'none';
			document.body.classList.remove('delivery-popup-no-scroll');
		}
	}
}

function toggleCalc() {
	if (document.getElementById('dc-details-info-partify')) {
		if (document.getElementById('dc-details-info-partify').style.display != 'block')
			document.getElementById('dc-details-info-partify').style.display = 'block';
		else
			document.getElementById('dc-details-info-partify').style.display = 'none';
	}
}

function receivedProductVariants(variants) {
	productVariants = variants;
}

function receivedDataVariantSku(sku) {
	dataVariantSku = sku;
}

function receivedDataVariantTitle(title) {
	dataVariantTitle = title;
}

function setProductSku(sku) {
	productSku = sku;
}

function setQualitySelectedType(selectedType) {
	qualitySelectedType = selectedType;
}

function getCountdownAndGeoValues() {

	// Must check if sku is available in asmData here.. This is necessary to prevent from polling
	// in the event the variants delivery countdown has generated.  No need to poll if they already exist
	let selectedSku = window.asmData[dataVariantSku];
	if (dataVariantTitle !== "Match Paint by VIN") {
		let attempts = 0;
		const maxAttempts = 120; // Run for max 60 seconds

		// If there is no sku data from asm yet, then that means it is still being fetched from the ASM api call
		// Consequently, need to poll with intervals in order to set the sku data in asmData global variable 
		// so that way it becomes available for the delivery countdown function ASAP
		if (!selectedSku) {
			const checkAsmData = setInterval(() => {
				selectedSku = window.asmData[dataVariantSku];
				if (selectedSku) {
					clearInterval(checkAsmData); // Stop polling once data is available
					const geoValues = selectedSku.geo || {};
					const countdownTime = selectedSku.countdownTime;
					if (countdownTime) {
						getCountdownTime(countdownTime);
						document.getElementById('dc-bottom-partify').style.display = 'block';
						document.getElementById('dc-top-partify').style.display = 'block';
						document.getElementById('dc-incorrect-zip-message').style.display = "none";
					} else {
						countdownTimeExists = false;
						document.getElementById('dc-bottom-partify').style.display = 'none';
						document.getElementById('dc-top-partify').style.display = 'none';
						document.getElementById('dc-incorrect-zip-message').style.display = "block";
					}
					getGeoValues(geoValues.city, geoValues.state, geoValues.zip, geoValues.country);
				} else if (attempts >= maxAttempts) {
					clearInterval(checkAsmData); // Stop polling after 1 minute
				}

				attempts++;
			}, 500); // Check every 0.5 seconds
		} else {
			const geoValues = selectedSku.geo || {};
			const countdownTime = selectedSku.countdownTime;
			if (countdownTime) {
				getCountdownTime(countdownTime);
				document.getElementById('dc-bottom-partify').style.display = 'block';
				document.getElementById('dc-top-partify').style.display = 'block';
				document.getElementById('dc-incorrect-zip-message').style.display = "none";
			} else {
				countdownTimeExists = false;
				document.getElementById('dc-bottom-partify').style.display = 'none';
				document.getElementById('dc-top-partify').style.display = 'none';
				document.getElementById('dc-incorrect-zip-message').style.display = "flex";
			}
			getGeoValues(geoValues.city, geoValues.state, geoValues.zip, geoValues.country);
		}
	}
}


// Retry queryETAS... used to prevent infinite loops from recursion
let retryCount = 0;

// Relocation is an identifier for where the call is coming from
// Relocation == 0 means queryAllETAs normally, when a quality is selected
// Relocation == 1 means customer changed the delivery address and the ETAs must be recalculated
// Relocation == 2 means rollover minutes.  The customer was on the product page and the countdown timer ran below 0... recalculated based off of new ETA
async function queryAllETAs(selectedType, relocation) {
	let productVariant;
	if (productVariants[selectedType]) {
		productVariant = productVariants[selectedType];
	} else {
		console.log('No product variants found for selected type');
	}


	let variantSkusArr = [];
	let duplicateETAArr = [];
	let unpaintedInventory = 0;
	let firstPaintedItem = true;
	let baseModelSku = '';

	productVariant.forEach((variant) => {
		let variantTitle = selectedType !== 'single' ? variant.variantTitle : variant.title;

		if (variantTitle === "Match Paint by VIN" || variantTitle === "Pintura de combinación por VIN") return;
		if (variantTitle.includes("Custom Paint Code")) return;


		let currentInventory;
		if (selectedType === 'single') {
			let currentQuantity = Number(variant.inventory_quantity);
			if (currentQuantity) {
				currentInventory = currentQuantity;
			} else {
				currentInventory = 0;
			}
		} else {
			currentInventory = Number(variant.variantInventory);
		}


		let calculateETA = false;
		let variantSku = '';

		// Must get the inventory of the unpainted items to compare with
		if (variantTitle === "Unpainted") {
			unpaintedInventory = currentInventory;
			calculateETA = true;
		} else {
			let inventoryDifference = unpaintedInventory - currentInventory;
			// If the inventory difference is 0, then we don't need to recalculate the ETA UNLESS it is the first painted item
			// in which case we will need to determine the ETA for that so it can be used across other variantSkus
			if (unpaintedInventory === inventoryDifference) {
				// For the first painted item only, determine the variantSku here so that way the function is only called once
				// and then set the baseModelSku to it to use as the reference
				if (firstPaintedItem) {
					firstPaintedItem = false;
					calculateETA = true;
					variantSku = qualityVariantRecalc(selectedType, variantTitle, productSku);
					baseModelSku = variantSku;
				} else {
					calculateETA = false;
				}
			} else {
				calculateETA = true;
			}
		}

		// Set the variantSku here only if it the baseModelSku has not been set
		if (!variantSku) {
			variantSku = qualityVariantRecalc(selectedType, variantTitle, productSku);
		}


		if (!window.asmData[variantSku]) {
			if (calculateETA) {
				variantSkusArr.push(variantSku);
			} else {
				duplicateETAArr.push(variantSku);
			}
		} else {
			console.log('variant already exists in asmData object');
		}
	})


	if (variantSkusArr.length > 0) {
		preloadASMData(variantSkusArr, duplicateETAArr, baseModelSku, relocation);
		let selectedSku;
		let attempts;
		let maxAttempts;
		if (dataVariantSku) {
			selectedSku = window.asmData[dataVariantSku];
			attempts = 0;
			maxAttempts = 120; // Run for max 60 seconds
		}

		// Countdown has gone below 0, need to recalculate
		if (relocation === 2) {
			if (dataVariantTitle && dataVariantTitle !== "Match Paint by VIN" && dataVariantTitle !== "Pintura de combinación por VIN") {
				if (!selectedSku) {
					const checkAsmData = setInterval(() => {
						selectedSku = window.asmData[dataVariantSku];
						if (selectedSku) {
							clearInterval(checkAsmData); // Stop polling once data is available
							const geoValues = selectedSku.geo || {};
							getCountdownTime(selectedSku.countdownTime);
							getGeoValues(geoValues.city, geoValues.state, geoValues.zip, geoValues.country);
						} else if (attempts >= maxAttempts) {
							clearInterval(checkAsmData); // Stop polling after 1 minute
						}
						attempts++;
					}, 500); // Check every 0.5 seconds
				} else {
					const geoValues = selectedSku.geo || {};
					getCountdownTime(selectedSku.countdownTime);
					getGeoValues(geoValues.city, geoValues.state, geoValues.zip, geoValues.country);
				}
			}
		}

		// User changed the zip code, need to recalculate
		if (relocation === 1) {
			if (dataVariantTitle && dataVariantTitle !== "Match Paint by VIN" && dataVariantTitle !== "Pintura de combinación por VIN") {

				const currentCountdownTime = await relocationCalculation(selectedSku, attempts, maxAttempts);

				if (!currentCountdownTime) {
					Object.keys(window.asmData).forEach(key => delete window.asmData[key]);
					window.asmData = structuredClone(asmDataBackup); // Restore backup
				}

			}
		}
	}
}

async function relocationCalculation(selectedSku, attempts, maxAttempts) {
	return new Promise((resolve) => {
		let currentCountdownTime;
		if (!selectedSku) {
			const checkAsmData = setInterval(() => {
				selectedSku = window.asmData[dataVariantSku];

				if (selectedSku) {
					clearInterval(checkAsmData); // Stop polling once data is available
					const geoValues = selectedSku.geo || {};
					currentCountdownTime = selectedSku.countdownTime;
					if (currentCountdownTime) {
						getCountdownTime(currentCountdownTime);
						document.getElementById('dc-bottom-partify').style.display = 'block';
						document.getElementById('dc-top-partify').style.display = 'block';
						document.getElementById('dc-incorrect-zip-message').style.display = "none";
					} else {
						countdownTimeExists = false;
						document.getElementById('dc-bottom-partify').style.display = 'none';
						document.getElementById('dc-top-partify').style.display = 'none';
						document.getElementById('dc-incorrect-zip-message').style.display = "flex";
					}
					getGeoValues(geoValues.city, geoValues.state, geoValues.zip, geoValues.country);

					if (document.getElementById('dc-alt-zip-apply-partify')) {
						document.getElementById('dc-alt-zip-apply-partify').innerHTML = apply;
					}

					// Only toggle the zip popup here if it currently is open.  If it is not, that means the 5 second timeout has triggered already
					if (document.getElementById('dc-alt-zip-holder-partify').style.display === 'block') {
						toggleZipInput();
					}

					resolve(currentCountdownTime); // Return the countdown time
				} else if (attempts >= maxAttempts) {
					clearInterval(checkAsmData); // Stop polling after max attempts
					console.log("Max attempts reached, resolving with undefined");
					resolve(undefined); // Ensure function completes
				}

				attempts++;
			}, 500); // Check every 0.5 seconds
		} else {
			const geoValues = selectedSku.geo || {};
			currentCountdownTime = selectedSku.countdownTime;
			if (currentCountdownTime) {
				getCountdownTime(currentCountdownTime);
				document.getElementById('dc-bottom-partify').style.display = 'block';
				document.getElementById('dc-top-partify').style.display = 'block';
				document.getElementById('dc-incorrect-zip-message').style.display = "none";
			} else {
				countdownTimeExists = false;
				document.getElementById('dc-bottom-partify').style.display = 'none';
				document.getElementById('dc-top-partify').style.display = 'none';
				document.getElementById('dc-incorrect-zip-message').style.display = "flex";
			}
			getGeoValues(geoValues.city, geoValues.state, geoValues.zip, geoValues.country);

			if (document.getElementById('dc-alt-zip-apply-partify')) {
				document.getElementById('dc-alt-zip-apply-partify').innerHTML = apply;
			}


			// Only toggle the zip popup here if it currently is open.  If it is not, that means the 5 second timeout has triggered already
			if (document.getElementById('dc-alt-zip-holder-partify').style.display === 'block') {
				toggleZipInput();
			}
			resolve(currentCountdownTime); // Return immediately if data is available
		}
	});
}

const shopLocale = window.shopLocale || 'en'; // Default to 'en' if not set

var asm_timeout;
var asm_store_id = 'partify-usa-123';
var asm_item_sku = '';
var asm_variant = false;
let asm_zip_code = '';
var asm_country_code = 'US';
var x_interval;
let variantSku;
let qualitySku;
let baseSku;
// let productVariants;
let dataVariantSku;
let dataVariantTitle;
let productSku;
let qualitySelectedType;
let baseZipForRevert;
let asmDataBackup;
let countdownTimeExists = true;
let applyButtonTimeout;

let apply = shopLocale === 'en' ? 'Apply' : 'Aplicar';

window.asmData = {};