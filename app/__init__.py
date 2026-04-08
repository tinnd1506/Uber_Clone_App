from flask import Flask
from config import Config
from .database import setup_sqlite

app = Flask(__name__)
app.config.from_object(Config)

# Initialize login manager before importing routes
from app.auth import login_manager
login_manager.init_app(app)

setup_sqlite() 

from app import models, routes
