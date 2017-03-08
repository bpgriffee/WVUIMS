import json
import pymongo
from pymongo import MongoClient
client = MongoClient('mongodb://root:oJ7mekx8Dc1H@localhost:27017/')
#db.authenticate('Admin', 'oJ7mekx8Dc1H')
db = client.test
items = db.items

from flask import Flask
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

@app.route('/')
def home_message():
	return 'Navigate to /api to see a help message.\n'

@app.route('/api')
def api_help():
	return 'Here is how you use the API.\n'


@app.route('/items')
def api_item_list():
	return db.items.find()[0]



if __name__ == '__main__':
	app.run(debug=True)
