# translation endpoints

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
CORS(bp, supports_credentials=True, resources={r"/*": {"origins": "*"}})


# @bp.route('/create', methods=['POST'])
# def create():
#     word_ids = request.json
#     # word = request.json.get('word')
#     # description = request.json.get('description')
#     # example = request.json.get('example')
#     # language = request.json.get('language')
#     # if not word_ids:
#     #     word_ids = ""
#     # if word_ids:
#     #     word_ids =  ','.join(map(str, word_ids))
#     # if not word:

#     print(word_ids[0][""])
#     return make_response(jsonify(word_ids))


# @bp.route('/edit', method=['PUT'])
# def edit():
#     pass


# @bp.route('/delete/<id>', method=['DELETE'])
# def delete(id):
#     pass


@bp.route('/get_offline', methods=['GET'])
def get_offline():
    result = sql.select("translations", "", "*")
    return make_response(jsonify(result))

@bp.route('/get_suggest/<lang_base>/<lang_to>/', methods=['GET'])
def get_suggest_empty(lang_base,lang_to):
    return get_suggest(lang_base,lang_to,"")

@bp.route('/get_suggest/<lang_base>/<lang_to>/<word>', methods=['GET'])
def get_suggest(lang_base, lang_to, word):
    # if not lang or word: 
    #     return make_response(jsonify({"word_creation": False, "error": ""}))
    result = sql.select("translations", "word LIKE '%" + word + "%' and language = '" + lang_base + "'", "id",
                        "word_id")
    ids = []
    for i in result:
        ids.append(i['word_id'])
    ids = format(str(tuple(ids)))
    result = sql.select("translations as translation left join translations as translation1 on translation.word_id = translation1.word_id", "translation.word_id in {} and translation.language = '{}' and translation1.language = '{}'".format(ids, lang_base, lang_to), "translation.word_id, translation.word as original, translation1.word as word, translation1.description as definition, translation1.id as id")
    print(result)
    return make_response(jsonify(result))


@bp.route('/get_word/<lang>/<id>', methods=['GET'])
def get_word(lang, id):
    # if not lang or word: 
    #     return make_response(jsonify({"word_creation": False, "error": ""}))
    # result = sql.select("translations", "id = '" +  word + "' and language = '" + lang + "'", "id", "word")
    result = sql.select("translations", "id = " + id, "id", "word_id")
    result = sql.select('translations', "word_id = {} AND language = '{}'".format(result[0]['word_id'], lang), "word",
                        "description", "example", "language")
    return make_response(jsonify(result))



# select
# 	translation.word_id, translation.word as original,
#     translation1.word as definition, translation1.description as example, translation1.id as id
# from
# 	translations as translation
# left join translations as translation1
#     on translation.word_id = translation1.word_id
# WHERE
# 	translation.word_id in ('61', '66', '68')
# and
# 	translation.language = 'fi' and translation1.language = 'sv'
