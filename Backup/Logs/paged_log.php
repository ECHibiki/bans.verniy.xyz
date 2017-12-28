<!DOCTYPE html>
<html>
	<head>
		<script type="text/javascript" src = "../Scripts/TableFunctions.js"></script>
		<link href="../Scripts/IndexStyle.css" rel="stylesheet" type="text/css"></style>
	</head>
	<body>
		<a href = "/Logs">Back to Log Listings</a>
	<span>
			<h2>Paged Ban Log</h2>
			<p>
				<label>Insert Board Query</label> <input id="refinement" type="text" /> <input id="set" onclick="constructTable()" type="button" value="Refine" />
				<span id="count"></span> <input id="refresh" onclick="refreshFunction()" type ="button" value = "Refresh">
			</p>
			<a href = "" itemprop="">Previous</a><a href = "" itemprop="">Next</a><br/>
			<table id="bansTable">
				<tbody>
					<tr>
						<td>...Loading Entries...</td>
					</tr>
				</tbody>
			</table>
			<p>
				Verniy 2017: Last Updated 26/12/2017<br/>
				Inquiries to be sent to the gmail account of ECVerniy
			</p>
		</span>
	</body>
</html>