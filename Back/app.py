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

    try:
        # Assuming 'FeedbackID' is part of the data payload from the client
        FeedbackID = data['FeedbackID']
        
        # Update feedback record
        db.session.execute(text("""UPDATE feedback 
                                   SET UserID = :UserID, AcademicYear = :AcademicYear, School = :School, 
                                    Other = :Other, Date = :Date, Completed = :Completed, Author = :Author
                                   WHERE FeedbackID = :FeedbackID"""), {"UserID": UserID, "AcademicYear": data['academicYear'], "School": data['school'],"Other": data['other'], "Date": data['date'], "Completed": "Completed", "Author": data['author'], "FeedbackID": FeedbackID})

        # Update ModuleFeedback records associated with the given FeedbackID
        db.session.execute(text("""UPDATE ModuleFeedback
                                   SET StudentInfo = :StudentInfo, 
                                    ModuleEval = :ModuleEval, InclusiveNature = :InclusiveNature, 
                                    PastChanges = :PastChanges, FutureChanges = :FutureChanges
                                   WHERE FeedbackID = :FeedbackID"""), {"FeedbackID": FeedbackID, "StudentInfo": data['studentInfo'], "ModuleEval": data['moduleEval'], "InclusiveNature": data['inclusiveNature'], "PastChanges": data['pastChanges'], "FutureChanges": data['futureChanges']})

        db.session.commit()
        return jsonify({'result': 'success'}), 200
    except Exception as e:
        return jsonify({'result': 'failure', 'error': str(e)}), 500


# GET USER REVIEW - USED TO DISPLAY TABLES WITH REVIEWS
@app.route('/get-user-reviews')
def get_reviews():
    #userID = session.get('user_id') ONCE LOGIN IS SETUP
    UserID = 1

    try:
        # Join Feedback with ModuleFeedback, then ModuleFeedback with Module
        all_reviews = text("""SELECT mo.ModuleName, f.Deadline, f.Completed, f.FeedbackID
                        FROM Feedback f
                        JOIN ModuleFeedback mf ON f.FeedbackID = mf.FeedbackID
                        JOIN Module mo ON mf.ModuleID = mo.ModuleID
                        WHERE f.UserID = :UserID""")
        result = db.session.execute(all_reviews, {'UserID': UserID}).mappings().all()

        all_reviews = [{'moduleName': row['ModuleName'], 'deadline': row['Deadline'], 'completed': row['Completed'], 'feedbackID': row['FeedbackID']} for row in result]

        return jsonify(all_reviews)

    except Exception as e:
        print(e)
        return jsonify({'result': 'failure', 'error': str(e)}), 500


# GET ALL REVIEWS FOR ADMIN DASHBOARD
@app.route('/get-all-reviews')
def get_all_reviews():
    try:
        # Join Feedback with ModuleFeedback, then ModuleFeedback with Module
        all_reviews = text("""SELECT mo.ModuleName, mo.ModuleLead, f.Deadline, f.Completed
                        FROM Feedback f
                        JOIN ModuleFeedback mf ON f.FeedbackID = mf.FeedbackID
                        JOIN Module mo ON mf.ModuleID = mo.ModuleID""")
        result = db.session.execute(all_reviews).mappings().all()

        all_reviews = [{'moduleName': row['ModuleName'], 'deadline': row['Deadline'], 'completed': row['Completed'], 'moduleLead': row['ModuleLead']} for row in result]

        return jsonify(all_reviews)

    except Exception as e:
        print(e)
        return jsonify({'result': 'failure', 'error': str(e)}), 500


# GET MODULES FOR REVIEW DELEGATION
@app.route('/get-modules')
def get_modules():
    all_modules = text("""SELECT ModuleID, ModuleName, ModuleLead, ModuleCode, Credits
                       FROM Module""")

    result = db.session.execute(all_modules).mappings().all()

    all_modules = [{'moduleID': row['ModuleID'], 'moduleName': row['ModuleName'], 'moduleLead': row['ModuleLead'], 'moduleCode': row['ModuleCode'], 'credits': row['Credits']} for row in result]

    return jsonify(all_modules)


# ADD MODULE INTO DATABASE
@app.route('/add-module', methods=['POST'])
def add_module():
    data = request.get_json()

    try:
        # FIND THE USERID OF THE MODULES LEAD :ECTURER
        result = db.session.execute(text("""SELECT UserID
                                        FROM User
                                        WHERE Name = :ModuleLead"""), {'ModuleLead': data['moduleLead']})
        UserID_result = result.fetchone()

        if result is None:
            return jsonify({'result': 'failure', 'error': 'Module lead not found'}), 404

        UserID = UserID_result[0]

        add_result = db.session.execute(text("""INSERT INTO Module (ModuleCode, ModuleName, ModuleLead, Credits, UserID)
                                        VALUES (:ModuleCode, :ModuleName, :ModuleLead, :Credits, :UserID)"""), {"ModuleCode": data['moduleCode'], "ModuleName": data['moduleName'], "ModuleLead": data['moduleLead'], "Credits": data['credits'], "UserID": UserID})

        db.session.commit()

        return jsonify({'result': 'success'}), 200

    except Exception as e:
        return jsonify({'result': 'failure', 'error': str(e)}), 500


# DELEGATE REVIEWS
@app.route('/delegate-reviews', methods=['POST'])
def delegate_reviews():
    try:
        data = request.get_json()
        #userID = session.get('user_id') ONCE LOGIN IS SETUP
        UserID = 1  
        Completed = "To-Complete"
        
        for element in data['moduleID']:
            # Insert into Feedback table
            feedback_result = db.session.execute(text("""INSERT INTO Feedback (UserID, Deadline, Completed)
                                                    VALUES (:UserID, :Deadline, :Completed)"""), {"UserID": UserID, "Deadline": data['deadline'], "Completed": Completed})
            
            # Get FeedbackID from previous query
            FeedbackID = db.session.execute(text("SELECT LAST_INSERT_ID()")).fetchone()[0]

            # Insert into ModuleFeedback table
            db.session.execute(text("""INSERT INTO ModuleFeedback (FeedbackID, ModuleID)
                                        VALUES (:FeedbackID, :ModuleID)"""), {"FeedbackID": FeedbackID, "ModuleID": element})
            
            db.session.commit()

        return jsonify({'result': 'success'}), 200

    except Exception as e:
        return jsonify({'result': 'failure', 'error': str(e)}), 500
    

if __name__ == '__main__':
    app.run(debug=True)