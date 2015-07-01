<body>
<head>
<style>
table {
    width:100%;
}
table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
}
th, td {
    padding: 5px;
    text-align: left;
}
th {
    background-color: black;
    color: white;

}

</style>
</head>
		<table>
			  <tr>
				<th>Year</th>
				<td>${agno.value}</td>
			  </tr>
			  <tr>
				<th>Value</th>
				<td>${anomalia_temp_min_anual.value} &#186;C</td>
			</tr>
		</table>
		<br>
		<table>
		<tr>
		<td style="border-collapse:collapse; border: none;"><img src="http://www.globalclimatemonitor.org/img/logo.png"/></td>
		<td style="border-collapse:collapse; border: none;">Global Climate Monitor</td>
		</tr>
		</table>
</body>