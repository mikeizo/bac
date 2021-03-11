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
		errorMessageText += '<li>Entering Water Temperature must be a number.</li>';
	}
	if (isNaN(cwtf)) {
		errorMessageText += '<li>Leaving Water Temperature must be a number.</li>';
	}
	if (isNaN(wbtf)) {
		errorMessageText += '<li>Wet Bulb Temperature must be a number.</li>';
	}

	if (errorMessageText == '') {
		if (cwtf >= hwtf) {
			errorMessageText += '<li>Leaving Water Temperature must be less than Entering Water Temperature.</li>';
		}
		if (wbtf >= cwtf) {
			errorMessageText += '<li>Wet Bulb Temperature must be less than Leaving Water Temperature.</li>';
		}
		if (wbtf > ( cwtf - 4)){
			errorMessageText += '<li>Wet Bulb Temperature must be at least 4&#176;F colder than Leaving Water Temperature.</li>';
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

		tonsDisplay = tons.toFixed(5);
		dutyResultText += '<strong>Tonnage Results:</strong><br>'+tonsDisplay+' Tons';

		data = "fgpm="+fgpm;
		data += "&hwtf="+hwtf;
		data += "&cwtf="+cwtf;
		data += "&wbtf="+wbtf;

    dutyResult.classList.add("alert");
    dutyResult.classList.add("alert-success");
		dutyResult.innerHTML = dutyResultText;
	}
}