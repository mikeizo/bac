let navButton = document.querySelector('#nav-mobile');
let navIcons = document.querySelector('#nav-icons');

navButton.onclick = function() {
  navIcons.classList.toggle('open');
}

function calculateTon() {
  let gpm = document.getElementById('gpm').value


  console.log(gpm)

  document.getElementById('output').innerHTML=gpm;

  return false

}




function calculate() {
  console.log('test');
	let fgpm = parseFloat(document.getElementById('fgpm').value);
	let hwtf = parseFloat(document.getElementById('hwtf').value);
	let cwtf = parseFloat(document.getElementById('cwtf').value);
	let wbtf = parseFloat(document.getElementById('wbtf').value);

  let errorMessage = document.getElementById( 'errorMessageText' );
  let dutyResult = document.getElementById( 'dutyResultText' );

	let range;
	let nominalCoolingLoad;
	let capacityFactor;
	let tons;
	let m3;
	let remander;
	let errorMessageText = '';
	let tonsDisplay = '';
	let dutyResultText = '';
	let data;

  if (isNaN(fgpm)) {
		errorMessageText += '<li>Flow (Gallons Per Minute) must be a number.</li>';
	}
	if (isNaN(hwtf)) {
		errorMessageText += '<li>Hot Water Temperature&#176;F must be a number.</li>';
	}
	if (isNaN(cwtf)) {
		errorMessageText += '<li>Cold Water Temperature&#176;F must be a number.</li>';
	}
	if (isNaN(wbtf)) {
		errorMessageText += '<li>Wet Bulb Temperature&#176;F must be a number.</li>';
	}

	if (errorMessageText == '') {
		if (cwtf >= hwtf) {
			errorMessageText += '<li>Cold Water Temperature &#176;F must be less than Hot Water Temperature &#176;F.</li>';
		}
		if (wbtf >= cwtf) {
			errorMessageText += '<li>Wet Bulb Temperature &#176;F must be less than Cold Water Temperature &#176;F.</li>';
		}
		if (wbtf > ( cwtf - 4)){
			errorMessageText += '<li>Wet Bulb Temperature &#176;F must be at least 4&#176;F colder than Cold Water Temperature &#176;F.</li>';
		}
	}

	if (errorMessageText != '') {
		errorMessage.classList.add("alert");
    errorMessage.classList.add("alert-danger");
		errorMessage.innerHTML = '<ul>' + errorMessageText + '</ul>';
		dutyResult.innerHTML = '';
	} else {
		errorMessage.classList.remove("alert");
    errorMessage.classList.remove("alert-danger");
		errorMessage.innerHTML = '';

		appraoch = (cwtf - wbtf);
		range = (hwtf - cwtf);
		nominalCoolingLoad = (((fgpm * range) * 500) / 15000);
		capacityFactor = (1688.67 *  (Math.pow(range, (0.0624 * (Math.log(appraoch)) - 0.6951))) * (Math.pow(appraoch, (0.053 * (Math.log(range)) - 0.8755))) * (Math.pow(wbtf, -1.025)) - 0.17455);
		tons = (nominalCoolingLoad * capacityFactor); // corrected cooling load (in Chiller Tons):

		tonsDisplay = tons.toFixed(0);

		if (tons <= 1080) {
			dutyResultText += tonsDisplay+' Tons<br />Your load requires 1 Module 1 - Extra Duty Unit.';
		}
		if (tons > 1080 && tons <= 2160) {
			dutyResultText += tonsDisplay+' Tons<br />Your load requires 2 Module 1 - Extra Duty Units or 1 Module 2 - Super Duty Unit.';
		}
		if (tons == 2160) {
			dutyResultText += tonsDisplay+' Tons<br />Your load requires 1 Module 2 - Super Duty Units.';
		}
		if (tons > 2160 && tons <= 3240) {
			dutyResultText += tonsDisplay+' Tons<br />Your load requires 2 Module 2 - Super Duty Units.';
		}
		if (tons == 3240) {
			dutyResultText += tonsDisplay+' Tons<br />Your load requires 1 Module 3 - Maximum Duty.';
		}
		if (tons > 3240 && tons <= 5400) {
			dutyResultText += tonsDisplay+' Tons<br />Your load requires 1 Module 3 - Maximum Duty and 1 Module 2 - Super Duty Units.';
		}
		if (tons > 5400 && tons < 6480) {
			dutyResultText += tonsDisplay+' Tons<br />Your load requires 2 Module 3 - Maximum Duty Units.';
		}

		if (tons >= 6480) {
			m3 = Math.floor(tons / 3240);
			remander = (tons - (m3 * 3240));

			if (remander <= 1080) {
				dutyResultText += tonsDisplay+' Tons<br />Your load requires '+m3+' Module 3 - Maximum Duty Units and 1 Module 1 - Extra Duty Unit.';
			} else {
				dutyResultText += tonsDisplay+' Tons<br />Your load requires '+m3+' Module 3 - Maximum Duty Units and 1 Module 2 - Super Duty Units.';
			}
		}

		data = "fgpm="+fgpm;
		data += "&hwtf="+hwtf;
		data += "&cwtf="+cwtf;
		data += "&wbtf="+wbtf;

    dutyResult.classList.add("alert");
    dutyResult.classList.add("alert-success");
		dutyResult.innerHTML = dutyResultText;
	}
}