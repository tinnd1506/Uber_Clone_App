from app import app
import os
from app import setup_sqlite
from app import Config
from dotenv import load_dotenv

from flask_debugtoolbar import DebugToolbarExtension

def check_create_database():
    if not os.path.exists("database.db"):
        setup_sqlite()

load_dotenv()

toolbar = DebugToolbarExtension(app)

if __name__ == '__main__':
    check_create_database()

    app.run(debug=True, host='0.0.0.0')
