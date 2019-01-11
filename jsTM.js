class TuringMachine{

	constructor(){
		this.tape = [];
		this.tapeLength = 1024;
		this.tapePtr = 0;

		for(var i = 0; i < this.tapeLength; i++){
			this.tape[i] = '#';
		}

		this.programs = [];
		this.progScanner = 0;

		this.state;
	}
	addBehaviour(state, read, actions, finalState){
		this.programs.push(new Configuration(state,read,actions,finalState));
		console.log("Syntax is assumed to be correct");
	}
	revealTape(){
		for (var i=0; i<this.tape.length; i++){
			console.log(this.tape[i]);
		}
	}
	async execute(){
		this.state = this.programs[this.progScanner].getState(); //
		while(this.tapePtr < this.tapeLength){
			//console.log(this.tape[this.tapePtr]);
			//console.log(this.programs[this.progScanner].getReadCondition());

			var rightSymbolScanned = this.tape[this.tapePtr] == this.programs[this.progScanner].getReadCondition();
			// define turing's "many" (any symbol except blank)
			if (this.programs[this.progScanner].getReadCondition() == "*" && this.tape[this.tapePtr] != "#" ){
				rightSymbolScanned = 1;
			}
			if (this.programs[this.progScanner].getReadCondition().length>1){
				var cond = this.programs[this.progScanner].getReadCondition();
				if (cond.includes("!") && cond.length==2 && cond[1] != this.tape[this.tapePtr]){
					// assume it's a single not statement
					rightSymbolScanned = 1;
				}
			}
			var inRightState = this.state==this.programs[this.progScanner].getState();
			var progFound = rightSymbolScanned && inRightState;
			//break;
			if (progFound){ //
				//console.log("made it!");
				var actions = this.programs[this.progScanner].getActions();
				var i = 0;
				// program currently allows for null actions without code needed
				// scan the specified actions for the given state
				while(i<actions.length){
					if (actions[i]=="E"){
						this.tape[this.tapePtr]="#";
						printValue(this.tapePtr," ");
					}
					else if (actions[i]=="R"){
						this.tapePtr++;
						await resolveAfter(currCell+1)
					}
					else if (actions[i]=="L"){
						this.tapePtr--;
						await resolveAfter(currCell-1)
					}
					else if(actions[i]=="P"){
						i++;
						this.tape[this.tapePtr] = actions[i];
						printValue(this.tapePtr,actions[i]);
					}
					i++;
				}
				this.state = this.programs[this.progScanner].getFinalState();
			}
			else{
				this.progScanner++;
				if (this.progScanner==this.programs.length){
					this.progScanner = 0;
				}
			}
		}
	}
}
class Configuration{
	constructor(initialState, read, actions, finalState){
		this.m = initialState;
		this.r = read;
		this.a = actions;
		this.f = finalState;
	}
	getFinalState(){
		return this.f;
	}
	getActions(){
		return this.a;
	}
	getState(){
		return this.m;
	}
	getReadCondition(){
		return this.r;
	}
}

var machine = new TuringMachine();

window.onload = function(){
	var visTape = document.getElementById("output");
	for (var i = 0; i < 1024; i++){
		var div = document.createElement("div");
		div.style.border = "1px solid #000000";
		div.id = "tmCell_";
		div.id = div.id.replace("_", i);
		div.style.width = 20;
		div.style.height = 20;
		div.className = "tmCell"; // for group access
		visTape.appendChild(div);
		if (i%80==0 && i!=0){
			var br = document.createElement("BR");
			var br2 = document.createElement("BR");
			visTape.appendChild(br);
			visTape.appendChild(br2);
		}
	}
	highlightCell(0);
}
var machRows = 0;
function addConfig(evt){
	var a =	document.getElementById("mConfig").value;
	var b = document.getElementById("read").value;
	var c = document.getElementById("actions").value;
	var d = document.getElementById("finalMConfig").value;
	if (b==""){
		console.log("b is the blank symbol");
		b = '#';
	}
	machine.addBehaviour(a,b,c,d);
	// add and fill new row to machine table
	var newRow = document.getElementById("mach").insertRow(machRows+1);
	machRows++;
	var x1 = newRow.insertCell(0);
	var x2 = newRow.insertCell(1);
	var x3 = newRow.insertCell(2);
	var x4 = newRow.insertCell(3);
	x1.innerHTML = a;
	x2.innerHTML = b;
	x3.innerHTML = c;
	x4.innerHTML = d;
	console.log("Added configuration");
}
function addManualConfig(mConf, read, actions, finalConf){
	if (mConf=="" || read==""  || finalConf==""){
		console.log("adding config failed");
		return;
	}
	machine.addBehaviour(mConf,read,actions,finalConf);
	// add and fill new row to machine table
	var newRow = document.getElementById("mach").insertRow(machRows+1);
	machRows++;
	var x1 = newRow.insertCell(0);
	var x2 = newRow.insertCell(1);
	var x3 = newRow.insertCell(2);
	var x4 = newRow.insertCell(3);
	x1.innerHTML = mConf;
	x2.innerHTML = read;
	x3.innerHTML = actions;
	x4.innerHTML = finalConf;
	console.log("Added configuration");

}
function runProgram(){
	machine.execute();
	machine.revealTape();
}
function clearTape(){
	machine.tape = [];
	machine.tapePtr = 0;

	for(var i = 0; i < machine.tapeLength; i++){
		machine.tape[i] = '#';
		printValue(i," ");
	}
}
var currCell = 0;
function highlightCell(num){
	//console.log(num);
	document.getElementById("tmCell" + parseInt(currCell)).style.border = "1px solid #000000";
	document.getElementById("tmCell" + parseInt(currCell)).style.backgroundColor = "#FFFFFF";

	document.getElementById("tmCell" + parseInt(num)).style.border = "1px solid #FF0000";
	document.getElementById("tmCell" + parseInt(num)).style.backgroundColor = "#999999";
	currCell = num;
}
function printValue(cellNumber, char){
	document.getElementById("tmCell"+cellNumber).innerHTML = char;
}
function loadTuring2(){
	addManualConfig("b","#","PeRPeRP0RRP0LL","o");
	addManualConfig("o", "1", "RPxLLL", "o");
	addManualConfig("o", "0", "", "q");
	addManualConfig("q", "0", "RR", "q");
	addManualConfig("q", "1", "RR", "q");
	addManualConfig("q", "#", "P1L", "p");
	addManualConfig("p", "x", "ER", "q");
	addManualConfig("p", "e", "R", "f");
	addManualConfig("p", "#", "LL", "p");
	addManualConfig("f", "0", "RR", "f");
	addManualConfig("f", "1", "RR", "f");
	addManualConfig("f", "#", "P0LL", "o");
}
function loadBinaryCounter(){
	addManualConfig("a", "#", "RRRRRRRRRRRRRRRRRRRR", "b");
	addManualConfig("b","#","P0","i");
	addManualConfig("i","0","P1","r");
	addManualConfig("i","1","P0L","i");
	addManualConfig("i","#","P1","r");
	addManualConfig("r","#","L","i");
	addManualConfig("r","*","R","r");
}

var thing = 0;
var slownessOfTM = 0;
function resolveAfter(cellNumber) {
  return new Promise(resolve => {
    setTimeout(() => {
      //thing++;
	//thing = currCell;
	highlightCell(cellNumber)
      resolve('resolved');
    }, slownessOfTM);
  });
}
async function asyncCall() {
  console.log('calling');
  var result = await resolveAfter2Seconds();
  console.log(result);
  // expected output: 'resolved'
  if (thing<1)
    asyncCall();
}
function slow(){
	slownessOfTM = 1000;
}
function medium(){
        slownessOfTM = 100;
}
function fast(){
        slownessOfTM = 0;
}

