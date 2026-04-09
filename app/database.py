import sqlite3
from pymongo import MongoClient

import os

def setup_sqlite():
    db_name = os.getenv("SQLITE_DB_NAME") or "database.db"
    with sqlite3.connect(db_name) as con:
        con.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT, role TEXT)")
        # Ensure email column exists in case Table was created in old version
        try:
            con.execute("ALTER TABLE users ADD COLUMN email TEXT")
        except sqlite3.OperationalError:
            pass # Column already exists

def setup_mongo():
    url = os.getenv("MONGO_DB_URL")
    client = MongoClient(url, tls=True, tlsAllowInvalidCertificates=True)
    db = client[os.getenv("MONGO_DB_NAME")]
    chat_collection = db["chat_history"]
    return db, chat_collection
