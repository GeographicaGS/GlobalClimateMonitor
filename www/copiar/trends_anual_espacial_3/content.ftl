<#--
Body section of the GetFeatureInfo template, it's provided with one feature collection, and
will be called multiple times if there are various feature collections
-->
<div class="feature_info">
	<a class="close_fancy" href="#"><img src="img/GCV_icon_cerrar.svg" alt="Close"/></a>
	<h5>Mean Temperature Trends</h5>

 <table>
   	<tr>
                <th>Period</th>
                <th>Value</th>
	</tr>
 	<#list features as feature>
 		<tr>
      			<td>${feature.period_n.value}</td>
      			<td>${feature.trend_anual.value} 
				 <#if feature.cod_variable.value ==  '1' ||  feature.cod_variable.value ==  '5'>
					mm. over period 
				 <#else>
					&#176;C over period 
				  </#if>
			</td>
		</tr>
	</#list>

</table>	 
</div>
