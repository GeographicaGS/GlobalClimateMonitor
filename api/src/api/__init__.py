from flask import Flask,jsonify
app = Flask(__name__)
app.config.update(
    DEBUG=True
)
import precipitation

@app.route('/', methods = ['GET'])                                            
def alive():
    return jsonify( { "status" : "running"})

