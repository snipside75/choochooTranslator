import os

from flask import Flask, render_template
from flask_cors import CORS
from flask_security import Security, SQLAlchemyUserDatastore
from ExtendedRegisterForm import ExtendedRegisterForm
# import ExtendedRegisterForm
from models import db, User, Role
from flask_mail import Mail
import logout, users, translator

# create and configure the app
app = Flask(__name__, instance_relative_config=True)

# setting up debugging
# set false on production
app.config['DEBUG'] = True
# sql alchemy configurations
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost/choochoo'
# making oauthlib working on local and insecure connections
# set to 0 on production
app.config['OAUTHLIB_INSECURE_TRANSPORT'] = 1
# password hash for user passwords
# should be changed on production
app.config['SECURITY_PASSWORD_SALT'] = 'hello'
# configuring the flask-security
app.config['SECURITY_TRACKABLE'] = True

# set the following to false if you want to make RESTful API
# otherwise set to true
app.config['WTF_CSRF_ENABLED'] = False

app.config['SECURITY_RECOVERABLE'] = True
# default secret key for the application
# should  be changed on production
app.config['SECRET_KEY'] = 'super-secret'
# mailer config
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'amir.noreply@gmail.com'
app.config['MAIL_PASSWORD'] = 'Kirekhar@yahoo'

mail = Mail(app)
# Setup Flask-Security
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore, register_form=ExtendedRegisterForm)

db.init_app(app)


# Setting up the database for models when the app first runs
@app.before_first_request
def initdb_command():
    db.create_all()


# Registering all the blueprints
app.register_blueprint(logout.bp)
app.register_blueprint(users.bp)
app.register_blueprint(translator.bp)

if __name__ == '__main__':
    # allowing cross origin requests
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
    # serving the application
    app.run(port=5000)
