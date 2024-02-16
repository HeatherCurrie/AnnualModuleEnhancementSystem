from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
db = SQLAlchemy(app)

# When review is submitted
@app.route('/submit-review-endpoint', methods=['POST'])
def submit_review():
    data = request.get_json()
    UserID = 1

    try:
        # Insert into Feedback
        postReview = db.session.execute(text("""INSERT INTO feedback (UserID, AcademicYear, School, Other, Date, Completed, Author)
                                        VALUES (:UserID, :AcademicYear, :School, :Other, :Date, :Completed, :Author)"""), {"UserID": UserID, "AcademicYear": data['academicYear'], "School": data['school'], "Other": data['other'], "Date": data['date'], "Completed": data['completed'], "Author": data['author']})
        db.session.commit()
        return "success"

    except Exception as e:
        print(e)

if __name__ == '__main__':
    app.run(debug=True)