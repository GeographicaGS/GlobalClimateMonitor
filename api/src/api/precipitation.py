from api import app
from flask import jsonify
from model.precipitationmodel import PrecipitationModel


@app.route('/precipitation_annual/<string:years>', methods = ['GET'])                                            
def precipitation_annual(years):
	pm = PrecipitationModel()
	year_array = years.split(",")

	response = []

	for y in year_array:
		precipitations = pm.getAnnualPrecipitation(y)
		year_pre = []
		for p in precipitations:
			year_pre.append(p["y"])
			year_pre.append(p["x"])
			year_pre.append(p["v"])

		response.append([ str(y),year_pre])

	return jsonify({ "results" :  response })


@app.route('/precipitation_annual_complete/<int:year>', methods = ['GET'])
def precipitation_annual_complete(year):
        return jsonify({ "results" :  PrecipitationModel().getAnnualPrecipitationComplete(year) })
