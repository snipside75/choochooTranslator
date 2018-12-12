# users endpoints


from flask_cors import CORS
from database.db import Mysql
import datetime
from flask import (
    Blueprint, request, jsonify, Flask)
import os
from flask_security import login_required, roles_required
from flask import make_response
from flask_security.utils import encrypt_password
import re

sql = Mysql()

bp = Blueprint('users', __name__, url_prefix='/users')
CORS(bp)


@login_required
@roles_required('admin')
@bp.route('/create', methods=['POST'])
def create():
    email = request.json.get("email")
    password = request.json.get("password")
    firstName = request.json.get("firstName")
    lastName = request.json.get('lastName')
    role = request.json.get("role")
    if email is None or password is None or firstName is None or lastName is None or role is None:
        return make_response(jsonify({"user_created": False, "error": "please enter all required fields"}), 400)

    else:
        emailCheck = sql.select("user", "email='" + email + "'", "email")
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return make_response(jsonify({"user_created": False, "error": "invalid email"}), 400)
        if emailCheck:
            return make_response(jsonify({"user_created": False, "error": "email already exists"}), 400)
        if validatePassword(password) != True:
            return make_response(jsonify({"user_created": False, "error": validatePassword(password)}), 400)
        password = encrypt_password(password)
        role_id = sql.select("role", "name='" + role + "'", 'id')
        role = role_id[0]['id']
        last_id = sql.insert(
            "insert into user (first_name, last_name, email, password, active) values (%s, %s, %s, %s, %s)",
            (firstName, lastName, email, password, 1))
        sql.insert("insert into roles_users (user_id, role_id) values (%s, %s)", (last_id, role))
        return make_response(jsonify({"user_created": True}), 200)


def validatePassword(password):
    if len(password) < 8:
        return ("Make sure your password is at least 8 letters")
    elif re.search('[0-9]', password) is None:
        return ("Make sure your password has a number in it")
    elif re.search('[A-Z]', password) is None:
        return ("Make sure your password has a capital letter in it")
    else:
        return True
