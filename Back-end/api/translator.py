from flask_cors import CORS
from database.db import Mysql
import datetime
from flask import (
    Blueprint, request, jsonify, Flask)
import os
from flask_security import login_required, roles_required
from flask import make_response
from flask_security.utils import hash_password
import re

sql = Mysql()

bp = Blueprint('translator', __name__, url_prefix='/translate')
CORS(bp)


@bp.route('/create', methods=['POST'])
def create():
    word_ids = request.json
    # word = request.json.get('word')
    # description = request.json.get('description')
    # example = request.json.get('example')
    # language = request.json.get('language')
    # if not word_ids:
    #     word_ids = ""
    # if word_ids:
    #     word_ids =  ','.join(map(str, word_ids))
    # if not word:

    print(word_ids[0][""])
    return make_response(jsonify(word_ids))


# @bp.route('/edit', method=['PUT'])
# def edit():
#     pass


# @bp.route('/delete/<id>', method=['DELETE'])
# def delete(id):
#     pass



@bp.route('/get_offline', methods=['GET'])
def get_offline():
    result = sql.select("translations", "","*")
    return make_response(jsonify(result))



@bp.route('/get_suggest/<lang>/<word>', methods=['GET'])
def get_suggest(lang, word):
    # if not lang or word: 
    #     return make_response(jsonify({"word_creation": False, "error": ""}))
    result = sql.select("translations", "word LIKE '%" +  word + "%' and language = '" + lang + "'", "id", "word")
    return make_response(jsonify(result))

@bp.route('/get_word/<lang>/<id>', methods=['GET'])
def get_word(lang, id):
    # if not lang or word: 
    #     return make_response(jsonify({"word_creation": False, "error": ""}))
    #result = sql.select("translations", "id = '" +  word + "' and language = '" + lang + "'", "id", "word")
    result = sql.select("translations", "id = " + id, "id", "word_id")
    result = sql.select('translations', "word_id = {} AND language = '{}'".format(result[0]['word_id'], lang), "word", "description", "example", "language" )
    return make_response(jsonify(result))

