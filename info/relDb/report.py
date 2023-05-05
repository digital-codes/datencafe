from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Teacher, Course, Student, StudentProfile, Enrollment

# Create engine and session
engine = create_engine('sqlite:///relDb.db')
Session = sessionmaker(bind=engine)
session = Session()

# Query all data
teachers = session.query(Teacher).all()
courses = session.query(Course).all()
students = session.query(Student).all()
profiles = session.query(StudentProfile).all()
enrollments = session.query(Enrollment).all()

# Define the styles for the report
styles = getSampleStyleSheet()
table_style = TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), '#cccccc'),
    ('TEXTCOLOR', (0, 0), (-1, 0), '#ffffff'),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 14),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
    ('BOTTOMPADDING', (0, -1), (-1, -1), 12),
    ('BACKGROUND', (0, 1), (-1, -1), '#f0f0f0'),
    ('GRID', (0, 0), (-1, -1), 0.5, '#dddddd'),
])

# Create the PDF document
doc = SimpleDocTemplate('report.pdf', pagesize=landscape(letter), topMargin=0.5*inch, bottomMargin=0.5*inch)
elements = []

# Add a title to the report
elements.append(Paragraph('Database Report', styles['Title']))

# Add a table for the teachers
data = [['Teachers'], ['ID', 'Name', 'Email', 'Courses']]
for teacher in teachers:
    data.append([teacher.id, teacher.name, teacher.email, ', '.join(course.name for course in teacher.courses)])
table = Table(data)
table.setStyle(table_style)
elements.append(table)

# Add a table for the courses
data = [['Courses'], ['ID', 'Name', 'Teacher', 'Students']]
for course in courses:
    data.append([course.id, course.name, course.teacher.name, ', '.join(student.name for student in course.students)])
table = Table(data)
table.setStyle(table_style)
elements.append(table)

# Add a table for the students
data = [['Students'], ['ID', 'Name', 'Email', 'Profile', 'Courses']]
for student in students:
    data.append([student.id, student.name, student.email, f'{student.profile.address} ({student.profile.date_of_birth})' if student.profile else '', ', '.join(course.name for course in student.courses)])
    #data.append([student.id, student.name, student.email, f'{student.profile.address} ({student.profile.date_of_birth})', ', '.join(course.name for course in student.courses)])
table = Table(data)
table.setStyle(table_style)
elements.append(table)

# Add a table for the enrollments
data = [['Enrollments'], ['ID', 'Student', 'Course', 'Grade']]
for enrollment in enrollments:
    data.append([enrollment.id, enrollment.student.name, enrollment.course.name, enrollment.grade])
table = Table(data)
table.setStyle(table_style)
elements.append(table)

# Build the PDF document and save it to disk
doc.build(elements)

