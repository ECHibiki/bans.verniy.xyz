<html>
	<head>
		<script type="text/javascript">
			var globalJSONData = ""

			window.onload = function(){
				console.log("Window Loaded");
				
				
				<?php 
					$jsonVar = "";
					$handle = fopen("/home4/ecorvid/bans.verniy.xyz/4Chan_Bans_Log.txt", "r");
					if ($handle) {
						while (($line = fgets($handle)) !== false) {
							$jsonVar = $jsonVar . $line;
						}

						fclose($handle);
					} else {
						// error opening the file.
						echo "Read Error" ;
					}
						$jsonVar = str_replace("`", "\`", $jsonVar);
						$jsonVar = str_replace("\"", "\\\"", $jsonVar);
								
						echo "globalJSONData  = `$jsonVar`;";
				?>
					globalJSONData  = globalJSONData.split("\n");
					buildFullTable();
			}
			
			function buildFullTable(){	
				var len = globalJSONData.length;
					var table = document.getElementById("bansTable");
					for(var i = len -1 ; i >= 0 ; i--){
						if(globalJSONData[i].trim() == "") continue;
						var tr = document.createElement("TR");
						table.appendChild(tr);
						var line = JSON.parse(globalJSONData[i]);
						var lineLen = line.length;
						//console.log(line);
						
						var td =  document.createElement("TD");
						var tdBoard = document.createTextNode("/" + line["board"] + "/");
						td.appendChild(tdBoard);
						tr.appendChild(td);
						
						var td =  document.createElement("TD");
						var tdName = document.createTextNode(line["name"]);
						td.appendChild(tdName);
						tr.appendChild(td);
						
						if(line["trip"] === undefined || line["trip"] === null) line["trip"] = "";
						var td =  document.createElement("TD");
						var tdTrip = document.createTextNode(line["trip"]);
						td.appendChild(tdTrip);
						tr.appendChild(td);
						
						var td =  document.createElement("TD");
						td.innerHTML = (line["com"]);
						tr.appendChild(td);
						
						var td =  document.createElement("TD");
						td.innerHTML = (line["action"]);
						tr.appendChild(td);	
						
						var td =  document.createElement("TD");
						td.innerHTML = (line["length"]);
						tr.appendChild(td);	
						
						var td =  document.createElement("TD");
						td.innerHTML = (line["reason"]);
						tr.appendChild(td);	
						
						var td =  document.createElement("TD");
						td.innerHTML = (line["now"]);
						tr.appendChild(td);							
				}						
			}
				
			function alterTable(){
				var table = document.getElementById("bansTable");
				var tableChilds = table.childNodes;
				var boardRefine = document.getElementById("refinement").value.trim();
				

				while(table.hasChildNodes()) table.removeChild(table.lastChild);
				buildFullTable();
				
				if(boardRefine !== ""){
						while(table.hasChildNodes()) table.removeChild(table.lastChild);
						buildFullTable()
					for(var i = tableChilds.length - 1 ; i >=  0 ; i--){
						//console.log(tableChilds);
						var curChildBoard = tableChilds[i].firstChild.textContent;
						if(curChildBoard !== boardRefine && curChildBoard !== "/" + boardRefine + "/"){
							table.removeChild(tableChilds[i]);
						}
					}
				}

			}
		</script>
	</head>
<body>
<br/>
<label>Insert Board Querry</label>
<input type="text" id="refinement">
<input type="button" id="set" value="Refine" onclick = "alterTable()">
<br/><br/>
<table id = "bansTable" border="solid black 1px">

</table>

</body>
</html>
