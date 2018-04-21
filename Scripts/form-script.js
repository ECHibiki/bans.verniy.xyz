//Files and character counter
var character_counter = document.getElementById('CharacterCount');
var error_msg = document.getElementById('errorMsg');
var error_msg_text = document.createTextNode("");
error_msg.appendChild(error_msg_text);
var textarea = document.getElementById('Comment');
var submit = document.getElementById('submit');
submit.setAttribute('disabled','');

function checkIfSubmitToBeDisabled(){
	//check all file fontainers
	for(var i = 1 ; i <= 4; i++){
		if(document.getElementById("f" + i).files.length == 0){
			var length = textarea.value.length;
			if(length == 0) {
				submit.setAttribute('disabled','');
				error_msg_text.nodeValue = "value", "Input a comment and/or file";
			}
		}
		else{
			var length = textarea.value.length;
			if(length > 500){
				characterCountColoring();
				return;
			}
			else{
				submit.removeAttribute('disabled');
				eerror_msg_text.nodeValue = "Click to submit";
				return;
			}
		}
	}
}

function characterCountColoring(){
	var length = textarea.value.trim().length;
	var red = 0; var blue = 100; var green = 100;
	if(length == 0){
		submit.setAttribute('disabled','');
		error_msg_text.nodeValue = "Input a comment and/or file";
	}
	else if(length > 500){
		red = 255; blue = 0; green = 0;
		submit.setAttribute('disabled','');
		error_msg_text.nodeValue = "Character count exceeded(>500)";
	}
	else{
		red = Math.ceil(length/500 * 180);
		submit.removeAttribute('disabled');
		error_msg.innerHTML = "Click to submit";
	}
	character_counter.innerHTML = '<span style=\'color:rgb(' + red + ',' + green + ',' + blue + ')\'>' + length + '</span>'
}

function setFileListener(file){
	file_node = document.getElementById(file);
	(function(_file_node){
		_file_node.addEventListener("change", checkIfSubmitToBeDisabled);
	})(file_node);
}

for(var i = 1 ; i <= 4; i++) setFileListener("f" + i);

if (textarea.addEventListener) {
	textarea.addEventListener('input', function() {
		characterCountColoring();
  }, false);
} 
else if (textarea.attachEvent) {
	textarea.attachEvent('onpropertychange', function() {
		characterCountColoring();
  });
}