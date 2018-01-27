//Enter to search table.
function enterForSearch(){
    document.getElementById("refinement").addEventListener("keydown", function(e){
        if(e.keyCode == 13){
            document.getElementById("set").click();
        }    
    });
}

//Construction of tables.
var global_JSON_Data = Array();
var archive_URL_Text = "[Archive Link]"
var window_width;
const WINDOW_CONSTANT = 1845;

var table = document.getElementById("bansTable");
var count = document.getElementById("count");
var counter = 0;
var pg1_counter;

var max_counter;
var minus_counter = 0;
var current_page;
var actual_page;
var max_page;
var board_refine = "";

var pg1_set = false;
var init = false;    
var table_built = Array();
var refresh_called = false;

var construct_interval;

var page_load_amount = 1000;

//sets global data in table and count if not set already. First to be called.
function loadFunction(){
    //set a refresh message
    if(init)count.innerHTML = "...Refreshing...";
    //else window.location.hash = '#' + 1;
    //load ledger data
    var xhttp_ledger = new XMLHttpRequest();
    xhttp_ledger.onreadystatechange = ajaxTableSetup;
    xhttp_ledger.open("GET", "4Chan_Bans_Log-Ledger.txt", true);
    xhttp_ledger.send();
}

function ajaxTableSetup(){
    if (this.readyState == 4 && this.status == 200) {
        var all_data = this.responseText.split("\n");
        //read the total entries in file
        max_counter = all_data[0];
        max_page = all_data[1];
        //set the file. Ordered in reverse chrono(highest numbered earliest).
        var hash = window.location.hash;
        
        if(hash != ""){
            var appost_loc = hash.indexOf("'");

            if(appost_loc == -1){
                appost_loc = hash.indexOf("%27");
                hash = hash.substr(0, appost_loc) + hash.substr(appost_loc + 2);
            } 

            current_page = max_page - parseInt(hash.substring(1, appost_loc)) + 1;
            if(appost_loc + 1 != hash.length)
                board_refine = hash.substring(appost_loc + 1);
        }
        else {
            current_page = max_page;
        }
        actual_page = max_page - current_page + 1;
        window_width = window.innerWidth;
        
        //check if loaded
        if(global_JSON_Data[current_page] === undefined || refresh_called){
            //load the log data
            var xhttp_log = new XMLHttpRequest();
            xhttp_log.onreadystatechange = function(){        
                table = document.getElementById("bansTable");
                count = document.getElementById("count");
                if (this.readyState == 4 && this.status == 200) {
                    while(table.hasChildNodes()) table.removeChild(table.lastChild);

                    global_JSON_Data[current_page] = this.responseText;
                    global_JSON_Data[current_page] = global_JSON_Data[current_page].substr(1);
                    global_JSON_Data[current_page] = global_JSON_Data[current_page].split("\n");
                    var len = global_JSON_Data[current_page].length;
                    for(var i = 0 ; i < len ; i++){
                        global_JSON_Data[current_page][i] = global_JSON_Data[current_page][i].substr(0, global_JSON_Data[current_page][i].length - 1);
                    }            
                    
                    table_built[current_page] = false;
                    
                    constructTable();
                    buildPages();

                    init = true;
                    refresh_called = false;
                }
                else if(this.readyState == 4 && this.status != 200){                
                    table.innerHTML = "<tr><td>Page Load Error. Try Changing Pages</td></tr>";
                }
            }
            xhttp_log.open("GET", "Logs/4Chan_Bans_Log-Reverse_Chrono-" + String(current_page) + ".json", true);
            xhttp_log.send();
        }
        else{
            constructTable();
            buildPages();

            init = true;
            refresh_called = false;
        }
    }
    else if(this.readyState == 4 && this.status != 200){
        table.innerHTML = "<tr><td>Ledger Load Error . Try Refreshing</td></tr>";
    }             
}

function refreshFunction(){
    table_built[current_page] = false;
    refresh_called = true;
    loadFunction();
}
    
function refineFunction(){
    //reloads page from index onhashchange
    board_refine = document.getElementById("refinement").value;
    if(actual_page === undefined) actual_page = "";
    window.location.hash = '#' + actual_page + "'" + board_refine;
}
    
function addArchiveToJSON(index){
    /**
    Thanks to http://archive.nyafuu.org/ : c / e / n / news / out / p / toy / vip/ vp / w / wg / wsr 
    Thanks to http://4plebs.org/ : adv / hr / o / pol / s4s / sp / trv / tv / x 
    Thanks to http://desuarchive.org : a / aco / an / co / d / fit / gif / his / int / k / m / mlp / qa / r9k / tg / trash / vr / wsg 
    Thanks to http://archive.loveisover.me : i / lgbt / t / u 
    Thanks to https://boards.fireden.net : cm / ic / sci / v / vg / y 
    Thanks to http://archiveofsins.com/ : h / hc / hm / r / s / soc 
    Thanks to http://thebarchive.com : b / bant 
    Thanks to https://rbt.asia : cgl / g / mu 
    */
    var A = "";
    switch(global_JSON_Data[current_page][index]["board"]){
        case "a": case "cm": case "co":case "ic":case "sci":case "tg":case "v":case "vg":case "y": 
            A = "https://boards.fireden.net/" + global_JSON_Data[current_page][index]["board"] + "/search/";
        break;
        case "adv": case "f": case "hr":case "o":case "pol":case "s4s":case "sp":case "tg":case "trv":case "tv": case "x":
            A = "https://archive.4plebs.org/" + global_JSON_Data[current_page][index]["board"] + "/search/";
        break;
        case "aco": case "an": case "c":case "d":case "fit":case "gif":case "his":case "int":case "k":case "m": case "mlp": case "qa":case "r9k":case "trash":case "vr":case "wsg":
            A = "https://desuarchive.org/" + global_JSON_Data[current_page][index]["board"] + "/search/";
        break;
        case "mu": case "cgl": case "g":
            A = "https://rbt.asia/" + global_JSON_Data[current_page][index]["board"] + "/search/";
        break;
        case "bant": case "vp": case "c":case "con":case "e":case "n":case "news":case "out":case "p":case "toy":case "vip":case "vp":case "w":case "wg":case "wsr":
            A = "https://archive.nyafuu.org/"  + global_JSON_Data[current_page][index]["board"] + "/search/";
        break;
        /*case "c": case "d": case "e":*/ case "i": case "lgbt": case "t": case "u":
            A = "https://archive.loveisover.me/"  + global_JSON_Data[current_page][index]["board"] + "/search/";
        break;
        default: 
            A = "https://archived.moe/" + global_JSON_Data[current_page][index]["board"] + "/search/";        
    }
    var B = "";
    var comment = global_JSON_Data[current_page][index]["com"] + "";
    if(comment !== ""){
        var Bi = comment.replace(/<wbr>/g, "");
        Bi = Bi.replace(/(<span class=.*\">|<\/span>|<div>|<\/div>|<table><\/table>|<a>|<\/a>|<p>|<\/p>|<s>|<\/s>|<br>|<\/br>|&#60;|&gt|&lt;|&#62;|^#|[?><\/.,'";:\]\[}{=\-+_)(*^%$@!~`])/g, " ");
        var B = Bi.substr(0,Bi.indexOf(" ", 50));
        if (B === "") B = Bi;
        B = "text/" +  B + "/";
    }
    else B = "";
    var C = (function(){
        var S = global_JSON_Data[current_page][index]["now"].split("/");
        return "end/20" + S[2].substr(0,2) + "-" + S[0] + "-" + (parseInt(S[1])+1) + "/";        
    })();
    var D 
    if(global_JSON_Data[current_page][index]["filename"] !== undefined)
        D  =  "filename/" + global_JSON_Data[current_page][index]["filename"];
    else D = "";
    var URL  = A + B + C + D;
    if(B !== ""){
        global_JSON_Data[current_page][index]["com"] =  global_JSON_Data[current_page][index]["com"] +  "</br></br><details><summary>" + archive_URL_Text + "</summary><a href = \"" + URL  + "\">" + URL + "</a></details>";
}
    else
        global_JSON_Data[current_page][index]["com"] =  global_JSON_Data[current_page][index]["com"] +  "<details><summary>" + archive_URL_Text + "</summary><a href = \"" + URL  + "\">" + URL + "</a></details>";
};


function buildFullTable(){    
    var len = global_JSON_Data[current_page].length;
    counter = 0;//current_page == max_page ? counter = 0 : counter = 0;    c
    
    //go through all retrived JSON
    for(var i = len -1 ; i >= 0 ; i--){

        var tr = document.createElement("TR");
        table.appendChild(tr);
        var lineLen;

        //first run clean up JSON data
        if(typeof(global_JSON_Data[current_page][i]) != "object") {
            if(global_JSON_Data[current_page][i].trim() == "") continue;        
            global_JSON_Data[current_page][i]  = JSON.parse(global_JSON_Data[current_page][i]);
            lineLen = global_JSON_Data[current_page][i].length;

            addArchiveToJSON(i);
        }
        else if(global_JSON_Data[current_page][i] === "") continue;

        counter++;
        
        //build table with data
        var line = global_JSON_Data[current_page][i];
        buildRow(tr, line);        
    }
    if(actual_page == 1){    
        if(!pg1_set) pg1_counter = counter;
        pg1_set = true;    
    }
    else{
        pg1_counter = max_counter % page_load_amount;//To be temporarily set
    }
    table_built[current_page] = true;
}
    
function stopFunction(){
    clearInterval(construct_interval);
}
    
var interval_counter = 0;
function buildFullTableInterval(){    
var len = global_JSON_Data[current_page].length;
//current_page == max_page ? counter = 0 : counter = 0;    

    //go through all retrived JSON
    
    var fake_continue = false;
    
    if(interval_counter == -1){
        stopFunction();
        return;
    }
    
    var tr = document.createElement("TR");
    table.appendChild(tr);
    var lineLen;
    //first run clean up JSON data
    if(typeof(global_JSON_Data[current_page][interval_counter]) !== "object") {
        if(global_JSON_Data[current_page][interval_counter].trim() == "") fake_continue = true;        
        else{
            global_JSON_Data[current_page][interval_counter]  = JSON.parse(global_JSON_Data[current_page][interval_counter]);
            lineLen = global_JSON_Data[current_page][interval_counter].length;

            addArchiveToJSON(interval_counter);
        }
    }
    else if(global_JSON_Data[current_page][interval_counter] === "") fake_continue = true;
    
    if(!fake_continue){
        counter++;
        //build table with data
        var line = global_JSON_Data[current_page][interval_counter];
        buildRow(tr, line);
        
    }
    interval_counter--;
    if(interval_counter == -1){
        if(actual_page == 1){    
            if(!pg1_set) pg1_counter = counter;
            pg1_set = true;    
        }
        table_built[current_page] = true;
    }
    else if(!pg1_set){
        pg1_counter = max_counter % page_load_amount;//To be temporarily set
    }
    //change the counter
    buildEntryCounter(board_refine);
}

function buildRow(tr, line){
        var width_ratio = window_width / WINDOW_CONSTANT;
        width_ratio = (width_ratio < 0.0 ? 0.0:width_ratio) ;
        
        var fontSize = "font-size:" + 18.0 * width_ratio/width_ratio + "px;"
        var max_width = "max-width:" + 45 * width_ratio/width_ratio + "px;";
        var td =  document.createElement("TD");
        td.setAttribute("class","boardItem");
        var tdBoard;
        if(line["board"] == "s4s")  var tdBoard = document.createTextNode("[" + line["board"] + "]");
        else tdBoard = document.createTextNode("/" + line["board"] + "/");
        td.setAttribute("style", fontSize + max_width);
        td.appendChild(tdBoard);
        tr.appendChild(td);
        
        var fontSize = "font-size:" + 18.0 * width_ratio + "px;"
        var max_width = "max-width:" + 160 * width_ratio + "px;";
        var td =  document.createElement("TD");
        td.setAttribute("class","nameItem");
        //if(line["name"].length > 10){}
        var tdName = document.createTextNode(line["name"]);
        td.setAttribute("style", fontSize + max_width);
        td.appendChild(tdName);
        tr.appendChild(td);
        
        var fontSize = "font-size:" + 18.00 * width_ratio + "px;"
        var max_width = "max-width:" + 145 * width_ratio + "px;";
        if(line["trip"] === undefined || line["trip"] === null) line["trip"] = "";
        var td =  document.createElement("TD");
        td.setAttribute("class","tripItem");
        var tdTrip = document.createTextNode(line["trip"]);
        td.setAttribute("style", fontSize + max_width);
        td.appendChild(tdTrip);
        tr.appendChild(td);
        
        var fontSize = "font-size:" + 18 * width_ratio/width_ratio + "px;"
        var max_width = "max-width:" + 800 * width_ratio + "px;";
        var td =  document.createElement("TD");
        td.setAttribute("class","comItem");
        td.setAttribute("style", fontSize + max_width);
        td.innerHTML = (line["com"]);
        tr.appendChild(td);
        
        var fontSize = "font-size:" + 20.0 * width_ratio + "px;"
        var max_width = "max-width:" + 200 * width_ratio + "px;";
        var td =  document.createElement("TD");
        td.setAttribute("class","actionItem");
        td.setAttribute("style", fontSize + max_width);
        td.innerHTML = (line["action"]);
        tr.appendChild(td);    
        
        var fontSize = "font-size:" + 20.0 * width_ratio + "px;"
        var max_width = "max-width:" + 70 * width_ratio + "px;";
        var td =  document.createElement("TD");
        td.setAttribute("class","lengthItem");
        td.setAttribute("style", fontSize + max_width);
        td.innerHTML = (line["length"]);
        tr.appendChild(td);    
        
        var fontSize = "font-size:" + 18.0 * width_ratio/width_ratio + "px;"
        var max_width = "max-width:" + 180 * width_ratio/width_ratio + "px;";
        var td =  document.createElement("TD");
        td.setAttribute("class","reasonItem");
        td.setAttribute("style", fontSize + max_width);
        td.innerHTML = (line["reason"]);
        tr.appendChild(td);    
        
        var fontSize = "font-size:" + 18.0 * width_ratio + "px;"
        var max_width = "max-width:" + 300 * width_ratio + "px;";
        var td =  document.createElement("TD");
        td.setAttribute("class","nowItem");
        td.setAttribute("style", fontSize + max_width);
        td.innerHTML = (line["now"]);
        tr.appendChild(td);                
}

    //make alterations to the table without effecting the data.
function constructTable(){
    //filter data down to certain boards
    document.getElementById("refinement").value = board_refine;
    
    minus_counter = 0;
    
    //rebuild    
    while(table.hasChildNodes()) table.removeChild(table.lastChild);
    if(board_refine === ""){
        counter = 0;
        interval_counter = global_JSON_Data[current_page].length - 1;
        construct_interval = setInterval(function(){
            for(var i = 0 ; i < 100; i++)
                buildFullTableInterval();
        },25);
    }
    //and refine 
    else if(board_refine !== ""){
        buildFullTable();
        //call global table
        var tableChilds = table.childNodes;
        for(var i = tableChilds.length - 1 ; i >=  0 ; i--){
            var fchild = tableChilds[i].firstChild;
            //check for empty
            if(fchild !== null)
                var curChildBoard = fchild.textContent;
            else continue;
            //not empty then check if it's in refine
            if(curChildBoard.replace(/[\/\[\]]/g, '') !== board_refine.replace(/[\/\[\]]/g, '')){
                table.removeChild(tableChilds[i]);
                minus_counter++;
            }
        }
        //change the counter
        buildEntryCounter(board_refine);
    }
}

function buildEntryCounter(board_refine){
    var temp_counter = counter;
    if(board_refine !== ""){
        var rhs = Math.floor((temp_counter - minus_counter) / 1000);
        var lhs = (temp_counter - minus_counter) % 1000 + "";
        while(lhs.length < 3) lhs = "0" + lhs;
		
        if(rhs == 0) count.innerHTML = "Displaying <strong>"  + lhs +  "</strong> results";
        else count.innerHTML = "Displaying <strong>"  + rhs + "," +  lhs + "</strong> results";
		
		if(temp_counter - minus_counter == 0){
			document.getElementById("bansTable").innerHTML = "<tr><td>No Results Found on Search /" + board_refine + "/</td></tr>";
		}
		
    }
    else{
        if(current_page - max_page != 0) temp_counter += page_load_amount * (actual_page - 2) + pg1_counter;
        //current
        var rhs = Math.floor(temp_counter / 1000) + "";
        var lhs = temp_counter % 1000 + "";
        while(lhs.length < 3) lhs = "0" + lhs;
        var current;
        if(rhs == 0) current = lhs;
        else current = rhs + "," + lhs;
        //max
        var rhs_max =  Math.floor(max_counter / 1000)+ "";
        var lhs_max = max_counter % 1000 + "";
        while(lhs_max.length < 3) lhs_max = "0" + lhs_max;
        var max;
        if(rhs_max == 0) max = lhs_max;
        else max = rhs_max + "," + lhs_max;
        //min(maybe for use later?)
        temp_counter -= page_load_amount * (actual_page) + pg1_counter;
        var rhs_min = Math.floor(temp_counter / 1000);
        var lhs_min = temp_counter % 1000 + "";
        while(lhs_min.length < 3) lhs_min  = "0" + lhs_min;
        var min;
        if(rhs_min == 0) min = lhs_min;
        else min = rhs_min + "," + lhs_min;

        count.innerHTML = "Displaying <strong>" + current +  "</strong> of <em>" + max +  "</em> results";
		
		if(temp_counter == 0){
			document.getElementById("bansTable").innerHTML = "No Results Found on search...This isn't supposed to happen...";
		}
    } 
}

function buildPages(){
    var page_tables = document.getElementsByClassName("page_table");
    var page_limit = parseInt(max_page) + 1;
    window_width = window.innerWidth;
    var margin = window.getComputedStyle(document.body).margin.replace("px", "");
    for(var tables = 0; tables < 2 ; tables++){
        //clear for rebuild
        while(page_tables[tables].hasChildNodes()){
            page_tables[tables].removeChild(page_tables[tables].firstChild);
        }

        var main_row = document.createElement("TR");
        var top_table = !top_table;
        page_tables[tables].appendChild(main_row);
        for(var page = 1; page <=  page_limit; page++){
            var entry = document.createElement("TD");
            entry.setAttribute("style","min-width:20px;");
            var entry_link = document.createElement("SPAN");
            var fontSize = "font-size:16px;"
            if(top_table){
                if(page == actual_page){
                    entry_link.innerHTML = "<a href = \"javascript:void(0)\" style='color:red;" + fontSize +"'>" + page + "</a>";
                }
                else{
                    entry_link.innerHTML = "<a href = \"javascript:void(0)\" style='" + fontSize +"'>" + page + "</a>";
                }
            }
            else {
                if(page == actual_page){
                    entry_link.innerHTML = "<a href = \"javascript:void(0)\" style='color:red'>Page " + page + "</a>";
                }
                else{
                    entry_link.innerHTML = "<a href = \"javascript:void(0)\"> Page " + page + "</a>";
                }
            }
            (function (_page){ 
                entry_link.addEventListener("click", function(){
                    if(actual_page != _page){
                        current_page = max_page - (_page - 1);
                        actual_page = _page;
                        table.innerHTML = "<tr><td>...Loading New Entries - page " + _page + " ...</td></tr>";
                        //reloads page from index onhashchange
                        window.location.hash = '#' + String(_page) + "'" + board_refine;
                        document.getElementById("pages").innerHTML = "Page " + actual_page;
                    }
                });
            })(page);
            document.getElementById("pages").innerHTML = "Page " + actual_page;
            entry.appendChild(entry_link);
            main_row.appendChild(entry);        
            
            if(page_tables[tables].offsetWidth >=  (window_width - margin * 3)){
                main_row.removeChild(entry);
                main_row = document.createElement("TR");
                page_tables[tables].appendChild(main_row);
                main_row.appendChild(entry);    
            }
        }
    }
}
