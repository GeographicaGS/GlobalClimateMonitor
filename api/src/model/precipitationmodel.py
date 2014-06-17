# coding=UTF8

"""
Document model

TODO: check all select * and state the fields.
TODO: check for SQL injection.
TODO: check for data validation

"""
from base.PostgreSQL.PostgreSQLModel import PostgreSQLModel

class PrecipitationModel(PostgreSQLModel):
    
    def getAnnualPrecipitation(self, year):
        sql = "select pre_anual/5000::float as v,st_x(geom) as x, st_y(geom) as y FROM pre_anual_espacial where agno=%s LIMIT 20000" 
        return self.query(sql, bindings=[year]).result()


   