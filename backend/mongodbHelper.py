from pymongo import MongoClient

class mongoDB:
    def __init__(self):
        self.client = MongoClient("mongodb+srv://Admin:Admin@cluster0-wnxdp.mongodb.net/test")
        self.db = self.client.business

