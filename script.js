/*** Setup onclicks and keydowns ***/

// Attach handlers to each button in our Calculator
var nums = document.getElementsByClassName("number");
for (var i=0; i<nums.length; i++){
	nums[i].onclick = function() {handleInput(this)};
}

var ops = document.getElementsByClassName("ops");
for (var j=0; j<ops.length; j++){
	ops[j].onclick = function() {handleOperation(this)};
}

var state = document.getElementsByClassName("state");
for (var k=0; k<state.length; k++){
	state[k].onclick = function() {handleState(this)};
}

var corrections = document.getElementsByClassName("corrections");
for (var ii=0; ii<corrections.length; ii++){
	corrections[ii].onclick = function() {handleCorrections(this)};
}

// Bind keyboard input to buttons on calculator
var calculator = document.getElementsByClassName("calculator")[0];
calculator.addEventListener("keydown", function(event){
	event.preventDefault();

	// Numbers (0 - 9), Decimal (.)
	if (event.keyCode >= 55 && event.keyCode <= 57) nums[event.keyCode - 55].click();
	else if (event.keyCode >= 52 && event.keyCode <= 54) nums[event.keyCode - 49].click();
	else if (event.keyCode >= 49 && event.keyCode <= 51) nums[event.keyCode - 43].click();
	else if (event.keyCode == 48) nums[9].click();
	else if (event.keyCode == 190) nums[10].click();

	// Backspace (<-)
	else if (event.keyCode == 8) corrections[1].click();

	// States (Q, E, Enter)
	else if (event.keyCode == 81) state[0].click();
	else if (event.keyCode == 13 || event.keyCode == 69) state[1].click();

	// Operations (W, A, S, D)
	else if (event.keyCode == 68) ops[0].click();
	else if (event.keyCode == 87) ops[1].click();
	else if (event.keyCode == 83) ops[2].click();
	else if (event.keyCode == 65) ops[3].click();

});


/*** Onclick handler functions ***/

// Handles all number and decimal buttons
// - Numbers (0 - 9)
// - Decimal (.)
function handleInput(button){
	var result = document.getElementsByClassName("result-text")[0];
	var curVal = result["value"];

	if (result["erase"]){
		curVal = "";
		result["erase"] = false;
	}
	
	// Handle clicking the . and 0 button when the result-text is empty or 0.
	if (button["value"] == "."){
		if (curVal.indexOf(".") >= 0){
			return true;
		}
		else if (curVal == "" || curVal == "0"){
			curVal = "0";
		}
	}
	else if (curVal == "0"){
		curVal = "";
	}
	
	// Update the fval or sval depending on whether an operation has been selected.
	if (result["op"]){
		result["value"] = curVal + button["value"];
		result["sval"] = curVal + button["value"];
	}
	else {
		result["value"] = curVal + button["value"];
		result["fval"] = curVal + button["value"];
	}
	result.scrollLeft = result.scrollWidth;
}

// Handles all operations
// - Addition (+)
// - Subtraction (-)
// - Multiplication (*)
// - Division (/)
function handleOperation(button){
	var result = document.getElementsByClassName("result-text")[0];
	var curVal = result["value"];

	if (result["sval"]){
		handleState(document.getElementsByClassName("state")[1]);
		result["op"] = button["value"];
		result["erase"] = true;
	}
	else {
		result["value"] = "";
		result["op"] = button["value"];
	}
}

// Handles the Clear and Equal buttons
// - Clear (AC)
// - Equal (=)
function handleState(button){
	var result = document.getElementsByClassName("result-text")[0];
	if (button["value"] == "AC"){
		result["value"] = "0";
		result["op"] = "";
		result["fval"] = "";
		result["sval"] = "";
	}
	else if (button["value"] == "="){
		var total = 0;
		var fval = result["fval"];
		var sval = result["sval"];
		var op = result["op"];

		if (op == "+") total = parseFloat(fval) + parseFloat(sval);
		else if (op == "-") total = parseFloat(fval) - parseFloat(sval);
		else if (op == "x") total = parseFloat(fval) * parseFloat(sval);
		else if (op == "/") total = parseFloat(fval) / parseFloat(sval);
		else total = parseFloat(result["value"]);

		result["value"] = Math.round(total * 100000000) / 100000000;
		result["fval"] = total;
		result["sval"] = "";
		result["op"] = "";
		result["erase"] = true;
	}
}

// Handles corrections or modifications to the current value.
// - Plus-minus (+/-)
// - Percent (% )
// - BackSpace (<-)
function handleCorrections(button){
	var result = document.getElementsByClassName("result-text")[0];
	var resultLen = result["value"].length;

	// Update the value on screen
	if (button["value"] == "plus-minus"){
		result["value"] *= -1;
	}
	else if (button["value"] == "percent"){
		result["value"] = parseFloat(result["value"]) / 100;
	}
	else {
		result["value"] = result["value"].substring(0, resultLen - 1);
	}

	// Update the hidden computing value
	if (result["op"]){
		result["sval"] = result["value"];
	}
	else {
		result["fval"] = result["value"];
	}
}


/*** Handle mouseover events ***/

$(".info-btn").hover(function(){handleTooltips(this)}, function(){$("#tooltip").html("---");});

function handleTooltips(button){
	var key = button.innerHTML;
	if (key == "Q") $("#tooltip").html("Clear (AC)");
	else if (key == "W") $("#tooltip").html("Multiply (x)");
	else if (key == "E") $("#tooltip").html("Calculate (=)");
	else if (key == "A") $("#tooltip").html("Add (+)");
	else if (key == "S") $("#tooltip").html("Subtract (-)");
	else if (key == "D") $("#tooltip").html("Divide ( / )");
}


