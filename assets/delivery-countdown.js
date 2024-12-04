function deliveryCountdown (store_id, item_sku) {
	if ((store_id != '') && (typeof store_id != 'undefined'))
		asm_store_id = store_id.replace ('.myshopify.com', '');

	if ((item_sku != '') && (typeof item_sku != 'undefined'))
		asm_item_sku = item_sku;

	if ((asm_store_id != '') && (asm_item_sku != '')) {
		clearTimeout(asm_timeout);

		var jsel = document.createElement('SCRIPT');
		jsel.type = 'text/javascript';
		jsel.src = 'https://www.advancedshippingmanager.com/clients/delivery_countdown/delivery_countdown.php?si='+ asm_store_id +'&is='+ asm_item_sku;
		document.getElementById('asm-ajax').appendChild (jsel);
	} else
		asm_timeout = setTimeout ('deliveryCountdown()', 100);
}

function activate_enter (evt) {
    evt = (evt) ? evt : event;
    var charCode = (evt.charCode) ? evt.charCode :
          ((evt.which) ? evt.which : evt.keyCode);
    if (charCode == 13) {
		deliveryRecalc();
//		ValidateShippingCalc();
        return false;
    } else {
        return true;
    }
}

function deliveryRecalc () {
	var asm_country_code = 'US';
	if (document.getElementById('dc-alt-country'))
		asm_country_code = document.getElementById('dc-alt-country').value;

	if (document.getElementById('dc-alt-zip')) {
		var asm_zip_code = document.getElementById('dc-alt-zip').value;

		clearInterval(x_interval);

		if (document.getElementById('dc-alt-zip-apply'))
			document.getElementById('dc-alt-zip-apply').innerHTML = 'Calculating...';
	
		var jsel = document.createElement('SCRIPT');
		jsel.type = 'text/javascript';
		jsel.src = 'https://www.advancedshippingmanager.com/clients/delivery_countdown/delivery_countdown.php?si='+ asm_store_id +'&is='+ asm_item_sku +'&zc='+ asm_zip_code +'&cc='+ asm_country_code +'&variant='+ asm_variant;
		document.getElementById('asm-ajax').appendChild (jsel);
	}
}

function setCountdownTime (target_date) {
	if (target_date) {
		var countDownDate = new Date(target_date);
		var countDownTime = countDownDate.getTime();

		var defined_weekday = new Array();
		defined_weekday[0] = 'Sunday';
		defined_weekday[1] = 'Monday';
		defined_weekday[2] = 'Tuesday';
		defined_weekday[3] = 'Wednesday';
		defined_weekday[4] = 'Thursday';
		defined_weekday[5] = 'Friday';
		defined_weekday[6] = 'Saturday';
		
		var defined_months = new Array();
		defined_months[0] = 'January';
		defined_months[1] = 'February';
		defined_months[2] = 'March';
		defined_months[3] = 'April';
		defined_months[4] = 'May';
		defined_months[5] = 'June';
		defined_months[6] = 'July';
		defined_months[7] = 'August';
		defined_months[8] = 'September';
		defined_months[9] = 'October';
		defined_months[10] = 'November';
		defined_months[11] = 'December';

		var defined_months_short = new Array();
		defined_months_short[0] = 'Jan';
		defined_months_short[1] = 'Feb';
		defined_months_short[2] = 'Mar';
		defined_months_short[3] = 'Apr';
		defined_months_short[4] = 'May';
		defined_months_short[5] = 'Jun';
		defined_months_short[6] = 'Jul';
		defined_months_short[7] = 'Aug';
		defined_months_short[8] = 'Sep';
		defined_months_short[9] = 'Oct';
		defined_months_short[10] = 'Nov';
		defined_months_short[11] = 'Dec';

		if (document.getElementById('dc-weekday'))
			document.getElementById('dc-weekday').innerHTML = defined_weekday[countDownDate.getDay()];

		if (document.getElementById('dc-month'))
			document.getElementById('dc-month').innerHTML = defined_months[countDownDate.getMonth()];

		if (document.getElementById('dc-month-short'))
			document.getElementById('dc-month-short').innerHTML = defined_months_short[countDownDate.getMonth()];

		if (document.getElementById('dc-day'))
			document.getElementById('dc-day').innerHTML = countDownDate.getDate();
	
		x_interval = setInterval(function() {
			var now = new Date().getTime();
	    
			var distance = countDownTime - now;
	    
			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	    
			if (document.getElementById('dc-hours'))
				document.getElementById('dc-hours').innerHTML = hours;

			if (document.getElementById('dc-minutes'))
				document.getElementById('dc-minutes').innerHTML = minutes;
	    
			if (distance < 0) {
				clearInterval(x_interval);
				deliveryCountdown();
			}
		}, 1000);

		if (document.getElementById('delivery-countdown'))
			document.getElementById('delivery-countdown').style.display = 'block';
	}
}

function setGeoValues (city, state, zip, country) {
	if (document.getElementById('dc-city'))
		document.getElementById('dc-city').innerHTML = city;

	if (document.getElementById('dc-state'))
		document.getElementById('dc-state').innerHTML = state;

	if (document.getElementById('dc-zip'))
		document.getElementById('dc-zip').innerHTML = zip;

	if (document.getElementById('dc-alt-zip'))
		document.getElementById('dc-alt-zip').value = zip;

	if (document.getElementById('dc-country'))
		document.getElementById('dc-country').innerHTML = country;

	if (document.getElementById('dc-alt-country'))
		document.getElementById('dc-alt-country').value = country;
}

function setZipValue (zip) {
	if (asm_variant == false)
		toggleZipInput();

	if (document.getElementById('dc-alt-zip-apply'))
		document.getElementById('dc-alt-zip-apply').innerHTML = 'Apply';

	if (document.getElementById('dc-zip'))
		document.getElementById('dc-zip').innerHTML = zip;

	if (document.getElementById('dc-alt-zip'))
		document.getElementById('dc-alt-zip').value = zip;
}

function toggleZipInput () {
	if (document.getElementById('dc-alt-zip-holder')) {
		if (document.getElementById('dc-alt-zip-holder').style.display != 'block')
			document.getElementById('dc-alt-zip-holder').style.display = 'block';
		else
			document.getElementById('dc-alt-zip-holder').style.display = 'none';
	}
}

function toggleCalc () {
	if (document.getElementById('dc-details-info')) {
		if (document.getElementById('dc-details-info').style.display != 'block')
			document.getElementById('dc-details-info').style.display = 'block';
		else
			document.getElementById('dc-details-info').style.display = 'none';
	}
}

var asm_timeout;
var asm_store_id = '';
var asm_item_sku = '';
var asm_variant = false;
var x_interval;