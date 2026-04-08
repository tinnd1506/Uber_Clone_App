from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, id, username, password, role, email):
        self.id = id
        self.username = username
        self.password = password
        self.role = role
        self.email = email
    
    def get_id(self):
        return str(self.id)
    
    @property
    def is_authenticated(self):
        return True
    
    @property
    def is_active(self):
        return True
    
    @property
    def is_anonymous(self):
        return False
