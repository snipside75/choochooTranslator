from flask_security.forms import RegisterForm
from wtforms import StringField

class ExtendedRegisterForm(RegisterForm):
    first_name = StringField('First Name')
    last_name = StringField('Last Name')
