<?php

/*
http://php.net/manual/en/xmlreader.readstring.php
*/
function read_string($reader) { 
    $node = $reader->expand(); 
    return $node->textContent; 
} 

//ledger files to check
$ledger_url = "../4Chan_Bans_Log-Ledger.txt";
$ledger_contents = explode("\n", fread(fopen($ledger_url, "r"), filesize($ledger_url)));
$ledger_contents[2] = $ledger_contents[1] - 1;

$ledger_string_A = "http://bans.verniy.xyz/Logs/4Chan_Bans_Log-Reverse_Chrono-".$ledger_contents[2].".txt";
$ledger_string_B = "http://bans.verniy.xyz/Logs/4Chan_Bans_Log-Reverse_Chrono-$ledger_contents[1].txt";
echo($ledger_string_A  . " " . $ledger_string_B . "<br/>");

//cehcks sitemap for changes
$xml_reader = new XMLReader;
$xml_reader->open("../sitemap.xml");

$write_A = true;
$write_B = true;
while($xml_reader->read()){
	if($xml_reader->nodeType == XMLReader::ELEMENT && $xml_reader->name == "loc"){
		if(strcmp($xml_reader->readString(), $ledger_string_A) == 0){
			echo $xml_reader->readString(). " == $ledger_string_A <br/> AAAA<br/><br/>";
			$write_A = false;
		}
		else if(strcmp($xml_reader->readString(), $ledger_string_B) == 0){
			echo $xml_reader->readString(). " == $ledger_string_B <br/> BBBB<br/><br/>";
			$write_B = false;
		}
	else echo $xml_reader->readString() . " !=  $ledger_string_A &&  !=  $ledger_string_B<br/>";
	}	
}
echo "<br/><br/>";
$xml_reader->close();

//change sitemap
$dom_sitemap = new DOMDocument;
$dom_sitemap->load("../sitemap.xml");

$head = $dom_sitemap->getElementsByTagName("urlset")[0];

if($write_A){
	$url = $dom_sitemap->createElement("url");
	$head->appendChild($url);

	$loc = $dom_sitemap->createElement("loc");
	$loc_text = $dom_sitemap->createTextNode($ledger_string_A);
	$loc->appendChild($loc_text);
	$url->appendChild($loc);

	$lastmod = $dom_sitemap->createElement("lastmod");
	$file_mod_time = date ("Y-m-dTH:i:s", filemtime("../Logs/4Chan_Bans_Log-Reverse_Chrono-" . $ledger_contents[2] . ".txt")) . "+00:00";
	$file_mod_time =  str_replace("CST", "T", $file_mod_time);
	$lastmod_text = $dom_sitemap->createTextNode($file_mod_time);
	$lastmod->appendChild($lastmod_text);
	$url->appendChild($lastmod);
	$priority = $dom_sitemap->createElement("priority");
	
	$priority = $dom_sitemap->createElement("priority");
	$priority_text = $dom_sitemap->createTextNode("0.64");
	$priority->appendChild($priority_text);
	$url->appendChild($priority);
}
if($write_B){
	$url = $dom_sitemap->createElement("url");
	$head->appendChild($url);

	$loc = $dom_sitemap->createElement("loc");
	$loc_text = $dom_sitemap->createTextNode($ledger_string_B);
	$loc->appendChild($loc_text);
	$url->appendChild($loc);

	$lastmod = $dom_sitemap->createElement("lastmod");
	$file_mod_time = date ("Y-m-dTH:i:s", filemtime("../Logs/4Chan_Bans_Log-Reverse_Chrono-" . $ledger_contents[1] . ".txt")) . "+00:00";
	$file_mod_time =  str_replace("CST", "T", $file_mod_time);
	$lastmod_text = $dom_sitemap->createTextNode($file_mod_time);
	$lastmod->appendChild($lastmod_text);
	$url->appendChild($lastmod);
	$priority = $dom_sitemap->createElement("priority");
	
	$priority = $dom_sitemap->createElement("priority");
	$priority_text = $dom_sitemap->createTextNode("0.64");
	$priority->appendChild($priority_text);
	$url->appendChild($priority);
}

//write to file;
$contents = $dom_sitemap->saveHTML();
echo($contents);
$sitemap = fopen("../sitemap.xml", "w");
fwrite($sitemap, $contents);

?>