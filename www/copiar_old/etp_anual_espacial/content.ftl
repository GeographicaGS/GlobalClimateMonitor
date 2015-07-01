<#--
Body section of the GetFeatureInfo template, it's provided with one feature collection, and
will be called multiple times if there are various feature collections
-->
<div class="feature_info">
	<a class="close_fancy" href="#"><img src="img/GCV_icon_cerrar.svg" alt="Close"/></a>
	<h5>Annual Global PET</h5>

 <table>
   	<tr>
                <th>Year</th>
                <th>Value</th>
	</tr>
 	<#list features as feature>
 		<tr>
      			<td>${feature.agno.value}</td>
      			<td>${feature.etp_anual.value} mm.</td>
		</tr>
	</#list>
</table>	 
</div>
