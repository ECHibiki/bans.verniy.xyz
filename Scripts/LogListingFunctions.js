var item_count;
var top_page;
var bottom_page;

var page_times = Array();
var current_file;
var old_file = 0;
var processing_file_time = false;

var listing_interval; 
var display_para_interval; 
var time_param_set = 0;
var display_changed = false

function beginAJAXCalls(){
	retrieveLedgerFile();
}

function retrieveLedgerFile(){
	var ledger_request = new XMLHttpRequest();
	ledger_request.onreadystatechange = ledgerFetch;
	ledger_request.open("GET", "../4Chan_Bans_Log-Ledger.txt");
	ledger_request.send();
}

function ledgerFetch(ledger){
	ledger = ledger.currentTarget;
	if(ledger.readyState == 4){
		ledger_arr = ledger.response.split("\n");
		item_count = ledger_arr[0];
		top_page = ledger_arr[1];
		bottom_page = 0;
		
		var page_max = parseInt(top_page)+1;		
		current_file = top_page;		
		
		display_para_interval = setInterval(alterDisplayParagraph, 16);
		listing_interval = setInterval(createListingItems, 16);
		
		for(var file = 0 ; file < page_max; file++){
			fetchFileTime(file);
		}
	}
	else{}
}

function fetchFileTime(file_number){
	$.ajax({
        type: 'HEAD',
        url: 'Logs/4Chan_Bans_Log-Reverse_Chrono-' + file_number + '.json',
        complete: function(file) {
			page_times[file_number] = file.getResponseHeader("last-modified");
			time_param_set ++;
			processing_file_time = false;
        }
	});
}

function alterDisplayParagraph(){
	if(time_param_set == parseInt(top_page)+1){
		document.getElementById("display_id").textContent = document.getElementById("display_id").textContent.replace("#", item_count).
			replace("$", (parseInt(top_page)+1)).replace("%", page_times[bottom_page]).replace("^", page_times[top_page]);
		document.getElementById("display_id").setAttribute("style", "display:block");
		display_changed = true;
	}
}

function unsetIntervals(){
	clearInterval(display_para_interval);
	clearInterval(listing_interval);
}

function createListingItems(){
	if(page_times[current_file] !== undefined){
		var listing_r = document.getElementById("rendered_listing_id");
		var li_r = document.createElement("LI");
		li_r.innerHTML = "<a href='pages?file=" + ((top_page - current_file) + 1) + "'>" + page_times[current_file] +"</a>";

		listing_r.appendChild(li_r);
		
		var listing_j = document.getElementById("json_listing_id");
		var li_j = document.createElement("LI");
		li_j.innerHTML = "<a href=' Logs/4Chan_Bans_Log-Reverse_Chrono-" + (current_file) + ".json'>" + page_times[current_file] +"</a>";
		listing_j.appendChild(li_j);
		current_file--;
	}
	if(current_file < 0 && display_changed){ 
		unsetIntervals()
	};
}
