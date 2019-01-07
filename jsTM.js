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
	execute(){
		this.progScanner = 0;
		this.state = this.programs[this.progScanner].getState(); //
		while(this.tapePtr < this.tapeLength){
			//console.log(this.tape[this.tapePtr]);
			//console.log(this.programs[this.progScanner].getReadCondition());

			var rightSymbolScanned = this.tape[this.tapePtr] == this.programs[this.progScanner].getReadCondition();
			var inRightState = this.state==this.programs[this.progScanner].getState();
			//console.log(rightSymbolScanned);
			//console.log(inRightState);
			var progFound = rightSymbolScanned && inRightState;
			//console.log(progFound);
			//break;
			if (progFound){ //
				//console.log("made it!");
				var actions = this.programs[this.progScanner].getActions();
				var i = 0;
				//console.log(actions);
				while(i<actions.length){
					if (actions[i]=="E"){
						this.tape[this.tapePtr]="#";
					}
					else if (actions[i]=="R"){
						this.tapePtr++;
						highlightCell(currCell+1); // NOT WORKING YET
						//console.log(this.tapePtr);
					}
					else if (actions[i]=="L"){
						this.tapePtr--;
						highlightCell(currCell-1); // NOT WORKING YET
					}
					else if(actions[i]=="P"){
						i++;
						this.tape[this.tapePtr] = actions[i];
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
	for (var i = 0; i < 20; i++){
		var div = document.createElement("div");
		div.style.border = "solid #000000";
		div.id = "tmCell_"
		div.id = div.id.replace("_", i);
		div.style.width = 20;
		div.style.height = 20;
		visTape.appendChild(div);
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
function runProgram(){
	machine.execute();
	machine.revealTape();
}
function clearTape(){
	machine.tape = [];
	machine.tapePtr = 0;

	for(var i = 0; i < machine.tapeLength; i++){
		machine.tape[i] = '#';
	}
}
var currCell = 0;
function highlightCell(num){
	console.log(num);
	document.getElementById("tmCell" + parseInt(currCell)).style.border = "solid #000000";
	document.getElementById("tmCell" + parseInt(num)).style.border = "solid #FF0000";
	currCell = num;
}
