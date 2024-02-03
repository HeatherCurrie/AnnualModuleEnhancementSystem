from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://ukarbs3i5qntxwcz2za5:pscale_pw_T2OdCqF9wzzyx4vJAUiZVMyYUhzoA4YEY5DEbzHaTbc@aws.connect.psdb.cloud:3306/annual_enhancement_system'
db = SQLAlchemy(app)

@app.route("/login")
def login():
    pass