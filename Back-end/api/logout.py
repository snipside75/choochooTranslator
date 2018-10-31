import flask_security
from flask import Blueprint
from flask.json import jsonify

bp = Blueprint('logout', __name__, url_prefix='/logout')

@bp.route('/', methods=['get'])
def logout():
    flask_security.utils.logout_user()
    return jsonify(['logged out'])

