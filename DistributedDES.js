var encryptedString = "ªUµ[+À;%Eú5 nÈhåk\\";
var plaintextString = "This is a test message";

var foundPass = false;
var currentPass = new Uint8Array(8);
for(var i = 0; i < 8; i++)
{
	currentPass[i] = 0;
}


var initThread = function(myWorker)
{
	var objOut = {};
	objOut.encryptedString = encryptedString;
	objOut.plaintextString = plaintextString;
	objOut.startPass = new Uint8Array(8);
	for(var i = 0; i < 8; i++){
		objOut.startPass[i] = currentPass[i];}
	currentPass[3]++;
	objOut.endPass = new Uint8Array(8);
	for(var i = 0; i < 8; i++){
		objOut.endPass[i] = currentPass[i];}
	myWorker.onmessage = onworkermessage;
	myWorker.postMessage(objOut);
}

var onworkermessage = function(inObj)
{
	for(var i = 0; i < 8; i++){
		document.body.innerHTML += inObj.data.startPass[i] +" ";}
	document.body.innerHTML += "to ";
	for(var i = 0; i < 8; i++){
		document.body.innerHTML += inObj.data.endPass[i] +" ";}
	document.body.innerHTML += "took " + inObj.data.time+" milliseconds<br>";
	foundPass = foundPass || inObj.data.found;
	if (foundPass) 
	{
		if(inObj.data.found)
		{
			document.body.innerHTML += "<br>PASSWORD IS: ";
			for(var i = 0; i < 8; i++){
			document.body.innerHTML += inObj.data.password[i] +" ";}
			document.body.innerHTML +="<br><br>";
		}
	}
	else
	{
		if(currentPass[3] <= 128)
		{
			initThread(this);
		}
		else
		{
			document.body.innerHTML += "exhausted options <br>"
		}
	}

}

var spinUpThreads = function()
{
	for(var i = 0; i < 8; i++)
	{
		currentPass[i] = 0;
	}
	for(var i = 0; i < 7; i++)
	{
		var newWorker = new Worker("WebRTCFirstDraft.js");
		initThread(newWorker);
	}
}


spinUpThreads();
