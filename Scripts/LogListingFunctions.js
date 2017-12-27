window.onload = function(){
	detectBrowser();
	setNodeHref(document.getElementById("json_view_id"), 
	"https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc?hl=en",
	"https://addons.mozilla.org/en-US/firefox/addon/jsonview/");
	
	retrieveLedgerFile();
	alterDisplayParagraph();
	 createListingItems();
}

var item_count;
var top_page;
var top_page_time;
var bottom_page_time;

function retrieveLedgerFile(){
}

function alterDisplayParagraph(){
	document.getElementById("display_id").textContent = document.getElementById("display_id").textContent.replace("#", item_count).replace("$", top_page+1).replace("%", top_page_time).replace("^", bottom_page_time);
}

function createListingItems(){
	var listing = document.getElementById("json_listing_id");
	for(var file = top_page + 1; file > 0; file--){
		
	}
}
