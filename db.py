from pymongo import MongoClient
from random import randint
from pprint import pprint


client = MongoClient("mongodb+srv://Admin:Admin@cluster0-wnxdp.mongodb.net/test")
db = client.business

def login(username, password):
	usr = {'username': username, 'password':password}
	r = client.business.user.find(usr)
	if r.count() == 0:
		return False
	if r.count() == 1:
		return True
	raise KeyError('Too many users returned')

def register(username, password, neighborhood, pic_url):
	# if(not isinstance(username, str)):
	# 	raise TypeError("Wrong username format")
	# if(not isinstance(password, str)):
	# 	raise TypeError("Wrong password format")
	# if(not isinstance(pic_url, str)):
	# 	raise TypeError("Wrong Profile picture URL format")			
	# if(not isinstance(neighborhood, str)):
	# 	raise TypeError("Wrong neighborhood format")	
	usr = {'username': username, 'password':password, 'neighborhood':neighborhood, 'pic_url':pic_url}
	db.user.insert_one(usr)	

def addTrip(lat, lon, desc, avl):
	trp = {'lat': lat, 'lon':lon, 'description':desc, 'availablity':avl}
	r = db.trip.insert_one(trp)
	if r.count() == 0:
		return False
	if r.count() == 1:
		return True
	raise KeyError('Too many trips returned')


def allTrips():
	r = db.trip.find()
	op = []
	for cr in r:
		op.append(cr)
		print(cr)
	return op

db.user.delete_many({})
register('viji','viji','1.2,3.4','www')
print(login('viji','viji'))

addTrip(1.2,3.4,'haha',[1,2,3])
addTrip(5.6,7.9,'ha',[1,4,5])
allTrips()