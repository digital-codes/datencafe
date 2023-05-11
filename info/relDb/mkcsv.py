import csv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Teacher, Course, Student, StudentProfile, Enrollment

# Create engine and session
engine = create_engine('sqlite:///relDb.db')
Session = sessionmaker(bind=engine)
session = Session()

# Query the teachers table
teachers = session.query(Teacher).all()

# Create a CSV file for the teachers table
with open('teachers.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['ID', 'Name', 'Email'])
    for teacher in teachers:
        writer.writerow([teacher.id, teacher.name, teacher.email])

# Query the courses table
courses = session.query(Course).all()

# Create a CSV file for the courses table
with open('courses.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['ID', 'Name', 'Teacher'])
    for course in courses:
        writer.writerow([course.id, course.name, course.teacher.name])

# Query the students table
students = session.query(Student).all()

# Create a CSV file for the students table
with open('students.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['ID', 'Name', 'Email'])
    for student in students:
        writer.writerow([student.id, student.name, student.email])

# Query the student_profiles table
profiles = session.query(StudentProfile).all()

# Create a CSV file for the student_profiles table
with open('profiles.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['ID', 'Address', 'Date of Birth', 'StudentID'])
    for profile in profiles:
        writer.writerow([profile.id, profile.address, profile.date_of_birth, profile.student_id])

# Query the enrollments table
enrollments = session.query(Enrollment).all()

# Create a CSV file for the enrollments table
with open('enrollments.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['ID', 'Student', 'Course', 'Grade'])
    for enrollment in enrollments:
        writer.writerow([enrollment.id, enrollment.student.name, enrollment.course.name, enrollment.grade])
