from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import os
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
SSL_CA_PATH = os.path.join(os.getcwd(), os.getenv('SSL_CA_PATH'))

app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'connect_args': {
        'ssl': {
            'ca': SSL_CA_PATH
        }
    }
}

db = SQLAlchemy(app)

# When review is submitted
@app.route('/submit-review-endpoint', methods=['POST'])
def submit_review():
    data = request.get_json()
    UserID = 1
    Completed = "Completed"

    try:
        # Insert into Feedback - MUST CHANGE USERID AND COMPLETED IN FUTURE
        postReview = db.session.execute(text("""INSERT INTO feedback (UserID, AcademicYear, School, Other, Date, Completed, Author)
                                        VALUES (:UserID, :AcademicYear, :School, :Other, :Date, :Completed, :Author)"""), {"UserID": UserID, "AcademicYear": data['academicYear'], "School": data['school'], "Other": data['other'], "Date": data['date'], "Completed": Completed, "Author": data['author']})
        db.session.commit()
        return jsonify({'result': 'success'}), 200

    except Exception as e:
        print(e)
        return jsonify({'result': 'failure', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)