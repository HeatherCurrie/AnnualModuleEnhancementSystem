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

# When module review is submitted
@app.route('/submit-review-endpoint', methods=['POST'])
def submit_review():
    data = request.get_json()
    UserID = 1
    Completed = "Completed"
    ModuleID = 1

    try:
        # Insert into Feedback - MUST CHANGE USERID AND COMPLETED IN FUTURE
        postReview = db.session.execute(text("""INSERT INTO feedback (UserID, AcademicYear, School, Other, Date, Completed, Author)
                                        VALUES (:UserID, :AcademicYear, :School, :Other, :Date, :Completed, :Author)"""), {"UserID": UserID, "AcademicYear": data['academicYear'], "School": data['school'], "Other": data['other'], "Date": data['date'], "Completed": Completed, "Author": data['author']})

        # Get FeedbackID from previous query
        FeedbackID = db.session.execute(text("SELECT LAST_INSERT_ID()")).fetchone()[0]

        # Insert into ModuleFeedback
        module_feedback_insert = text("""INSERT INTO ModuleFeedback (FeedbackID, ModuleID, ModuleLead, ModuleDetails, StudentInfo, ModuleEval, InclusiveNature, PastChanges, FutureChanges)
                                         VALUES (:FeedbackID, :ModuleID, :ModuleLead, :ModuleDetails, :StudentInfo, :ModuleEval, :InclusiveNature, :PastChanges, :FutureChanges)""")
        db.session.execute(module_feedback_insert, {"FeedbackID": FeedbackID, "ModuleID": ModuleID, "ModuleLead": data['moduleLead'], "ModuleDetails": data['moduleDetails'], "StudentInfo": data['studentInfo'], "ModuleEval": data['moduleEval'], "InclusiveNature": data['inclusiveNature'], "PastChanges": data['pastChanges'], "FutureChanges": data['futureChanges']})

        db.session.commit()
        return jsonify({'result': 'success'}), 200

    except Exception as e:
        print(e)
        return jsonify({'result': 'failure', 'error': str(e)}), 500

@app.route('/get-user-reviews')
def get_reviews():
    #userID = session.get('user_id') ONCE LOGIN IS SETUP
    UserID = 1

    try:
        all_reviews = text("SELECT School, Deadline FROM Feedback WHERE UserID = :UserID")
        result = db.session.execute(all_reviews, {'UserID': UserID}).mappings().all()

        # Explicitly converting each row to a dictionary
        all_reviews = [{'school': row['School'], 'deadline': row['Deadline']} for row in result]

        return jsonify(all_reviews)

    except Exception as e:
        print(e)
        return jsonify({'result': 'failure', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)