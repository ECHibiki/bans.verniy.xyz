<!DOCTYPE html>
<html>
	<head>
	<base href="http://bans.verniy.xyz"/>
		<title>Simple 4Chan Ban Log - Paged View</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=0.8">
		<script type="text/javascript" src = "/Scripts/TableFunctions.js?5"></script>
		<script></script>
		<link href="/Scripts/IndexStyle.css" rel="stylesheet" type="text/css"></style>
	</head>
	<body itemscope="" itemtype="http://schema.org/DataCatalog">
<?php
echo "
<div>
	<meta itemprop='url' content=\"/pages?file=" . $_GET['file'] . "\"/>
		<a href = '/listings'>Back to Log Listings</a>
";

$ledger = fopen("4Chan_Bans_Log-Ledger.txt", "r");
$entry_count = fgets($ledger);
$file_count = fgets($ledger);
fclose($ledger);


$low = ($_GET["file"] - 1);
if($low < 1) $low = 1;

$high = ($_GET["file"]) + 1;
if($high > $file_count + 1) $high = $file_count + 1;

$file_no = $file_count - $_GET["file"] + 1; 
	
$file_contents = file_get_contents("Logs/4Chan_Bans_Log-Reverse_Chrono-" . $file_no .".json");
if($file_no == $file_count)$file_contents[strpos($file_contents, ',', strlen($file_contents) - 5)] = ']';
$file_contents = json_decode($file_contents, true);

echo "<table id='pageTable'>";
$offset = 6;
$file_get = $_GET["file"] - $offset;
if($file_get < 0) $file_get = 0;

for($i = $file_get ; $i <  $file_count + 1 ; $i++){
		if($i == $_GET["file"] - 1) echo "<td><a style='color:red' href='/pages?file=" . ($i + 1) ."'>". ($i + 1) . "</a></td>";
		else if((ceil(($file_count + 1) / 2) + $file_get) < $file_count - 2 && $i == 10 + $file_get){
			echo "<td><a href='/pages?file=" . (ceil(($file_count + 1) / 2) + $file_get) ."'>". (ceil(($file_count + 1) / 2) + $file_get) . "</a></td>";
		}
		else if($i == $file_count){
			echo "<td><a href='/pages?file=" . ($i + 1) ."'>". ($i + 1) . "</a></td>";
		}
		else if($i == 11 + $file_get || $i == 9 + $file_get){
			echo "<td>...</td>";
		}
		else if($i < 11 + $file_get){
			echo "<td><a href='/pages?file=" . ($i + 1) ."'>". ($i + 1) . "</a></td>";
		}
}
echo "</table> </div>";

echo "
<div>
		<h2 itemprop='name'>V's 4Chan Ban Log - Pages</h2>
		<meta itemprop='description' content='An easy to read log of 4chan's ban page for both the ban evader and the innocent alike. Contains information what 4chan moderators ban by archiving the 4chan ban page at 4chan.org/bans. Updated every 15 minutes to stay up to date. Common bans such as GR15, GR5 etc. from every board(/a/, /pol/, /e/, /h/)'>
			<meta itemprop='keywords' content='4chan,bans,logger,shitposter,GR3,ban evasion,/a/,/c/,/h/,/d/,/e/'>
			<meta itemprop='version' content='Jan-03' id='versionInfo'/>

<p>
		Currently reading page <strong>". ($_GET["file"]) ."</strong> of <em>" . ($file_count + 1) ."</em>.<br>
		Total entries: $entry_count
		</p>
</div>";


echo "<div itemprop='dataset' itemscope='' itemtype='http://schema.org/DataSet'>
			<a href = 'pages?file=" . $low . "' itemprop='url'>Previous</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href = 'pages?file=" . $high ."' itemprop='url'>Next</a><br/>
			<meta itemprop='measurementTechnique' content='Page Logging'>
			<meta itemprop='sameAs' content='" . "Logs/4Chan_Bans_Log-Reverse_Chrono-$file_no.json" . "'>
			<meta itemprop='version' content='" . $file_no . "' id='versionInfo'/>
			<table id='bansTable'>
				<tbody>
";

echo "<meta itemprop='variableMeasured' content='Board'>";
echo "<meta itemprop='variableMeasured' content='Name'>";
echo "<meta itemprop='variableMeasured' content='Comment'>";
echo "<meta itemprop='variableMeasured' content='Action'>";
echo "<meta itemprop='variableMeasured' content='Duration'>";
echo "<meta itemprop='variableMeasured' content='Reason'>";
echo "<meta itemprop='variableMeasured' content='Time'>";

$useragent=$_SERVER['HTTP_USER_AGENT'];
$is_mobile;
if(strpos($useragent, "Mobile") !== false) $is_mobile = true;

if($is_mobile){
	$font_size = 'font-size:12px';
	foreach(array_reverse($file_contents) as $line){
	echo "<tr>";																													
	if($line["board"] == "s4s") echo "<td>[" . $line["board"] ."]</td>";
	else echo "<td style = \"font-size:8px\">/" . $line["board"] ."/</td>";
		//echo "<td style = \"max-width:150px;$font_size\">" . $line["name"] ."</td>";
		//echo "<td style = \"max-width:100px;$font_size\">" . $line["trip"] ."</td>";
		echo "<td style = \"max-width:500px;$font_size\">" . $line["com"] ."</td>";
		echo "<td style='$font_size'>" . $line["action"] ."</td>";
		//echo "<td style='$font_size'>" . $line["length"] ."</td>";
		//echo "<td style='$font_size'>" . $line["reason"] ."</td>";
		//echo "<td style='$font_size'>" . $line["now"] ."</td>";
	echo "</tr>";
}
}
else{
	foreach(array_reverse($file_contents) as $line){
	echo "<tr>";																													
	if($line["board"] == "s4s") echo "<td>[" . $line["board"] ."]</td>";
	else echo "<td>/" . $line["board"] ."/</td>";
		echo "<td style = \"max-width:150px\">" . $line["name"] ."</td>";
		echo "<td style = \"max-width:100px\">" . $line["trip"] ."</td>";
		echo "<td style = \"max-width:800px\">" . $line["com"] ."</td>";
		echo "<td>" . $line["action"] ."</td>";
		echo "<td>" . $line["length"] ."</td>";
		echo "<td>" . $line["reason"] ."</td>";
		echo "<td>" . $line["now"] ."</td>";
	echo "</tr>";
}
}


echo "</tbody></table></div>";

?>
		<div itemprop="about" >
			<p>
				<span itemprop="accountablePerson">Verniy 2017</span>: Last Updated <span itemprop="dateModified">03/1/2018</span><br/>
				<meta itemprop="author" content="ECHibiki">
				Metadata & CSS<br/>
				Inquiries to be sent to the gmail account of ECVerniy
			</p>
		</div>
	</body>
</html>