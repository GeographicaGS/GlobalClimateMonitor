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
				<th>Period</th>
				<td>${period_n.value}</td>
			  </tr>
			<tr>
				<th>Value</th>
      			<td>${trend_anual.value} 
				 <#if cod_variable.value ==  '1' ||  cod_variable.value ==  '5'>
					mm. over period 
				 <#else>
					&#176;C over period 
				  </#if>
				</td>
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