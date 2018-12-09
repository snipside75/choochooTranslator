import mysql
import sys

# sys.path.insert(1,'..')

# from ..services.encryptionCore import *

__author__ = 'amir'
import mysql.connector
from mysql.connector import errorcode, Error

class Mysql:
    __instance = None

    __host = None
    __user = None
    __password = None
    __database = None

    __session = None
    __connection = None
    # __enc = encryptionCore

    def __init__(self):
        self.__host = 'localhost'
        self.__user = 'root'
        self.__password = ""
        self.__database = 'choochoo'

    # Open connection with database
    def _open(self):
        try:
            cnx = mysql.connector.connect(host=self.__host, user=self.__user, password=self.__password,
                                          database=self.__database)
            self.__connection = cnx
            self.__session = cnx.cursor(buffered=True, dictionary=True)
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                print('Something is wrong with your user name or password')
            elif err.errno == errorcode.ER_BAD_DB_ERROR:
                print('Database does not exists')
            else:
                print(err)

    def _close(self):
        self.__session.close()
        self.__connection.close()

    def insert(self, query, values):
        query = query
        values = values
        print (query)
        print (values)
        self._open()
        self.__session.execute(query, values)
        self.__connection.commit()
        self._close()
        return self.__session.lastrowid

    def select(self, table, where, *args):
        result = None
        query = "SELECT "
        keys = args
        l = len(keys) - 1
        for i, key in enumerate(keys):
            if key == '*':
                query += key
            else:
                query += "" + key + ""
                if i < l:
                    query += ","
        query += " FROM %s" % table
        if where:
            query += " WHERE %s" % where
        print (query)
        try:
            self._open()
            self.__session.execute(query)
            result = self.__session.fetchall()
            return result
        except Error as e:
            print(e)

    def update(self, table, where, **kwargs):
        query = "UPDATE %s SET " % table
        keys = list(kwargs.keys())
        values = list(kwargs.values())
        l = len(keys) - 1
        for i, key in enumerate(keys):
            query += "" + key + "=%s"
            if i < l:
                query += ","
        query += " WHERE %s" %where
        print(query)
        self._open()
        self.__session.execute(query, values)
        self.__connection.commit()
        self._close()

    def delete(self, table, column, index):
        query = "DELETE FROM %s WHERE %s=%d" % (table, column, index)
        self._open()
        self.__session.execute(query)
        self.__connection.commit()
        self._close()

    def call_store_procedure(self, name, *args):
        result_sp = None
        self._open()
        self.__session.callproc(name, args)
        self.__connection.commit()
        for result in self.__session.stored_results():
            result_sp = result.fetchall()
        self._close()
        return result_sp
