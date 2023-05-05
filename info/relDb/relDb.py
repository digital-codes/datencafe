from sqlalchemy import create_engine, Table, Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker, declarative_base
# from sqlalchemy.ext.declarative import declarative_base

from datetime import datetime, date

# from models import Base, Teacher, Course, Student, StudentProfile, Enrollment

# Create the engine and connect to the database
engine = create_engine('sqlite:///relDb.db', echo=True)

# Create a session maker
Session = sessionmaker(bind=engine)

# Create the base class for declarative models
Base = declarative_base()


class StudentProfile(Base):
    __tablename__ = 'student_profiles'
    id = Column(Integer, primary_key=True)
    address = Column(String)
    date_of_birth = Column(Date)
    student_id = Column(Integer, ForeignKey('students.id'))

class Student(Base):
    __tablename__ = 'students'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    profile = relationship('StudentProfile', uselist=False)
    enrolled_courses = relationship('Course', secondary='enrollments', 
                            primaryjoin='Student.id==Enrollment.student_id',
                            secondaryjoin='Enrollment.course_id==Course.id',
                            backref='enrolled_students')

class Course(Base):
    __tablename__ = 'courses'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    teacher_id = Column(Integer, ForeignKey('teachers.id'))
    teacher = relationship('Teacher', back_populates='courses')
    students = relationship('Student', secondary='enrollments', 
                            primaryjoin='Course.id==Enrollment.course_id',
                            secondaryjoin='Enrollment.student_id==Student.id',
                            backref='courses')

# Define the Enrollment model
class Enrollment(Base):
    __tablename__ = 'enrollments'
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey('students.id'))
    course_id = Column(Integer, ForeignKey('courses.id'))
    grade = Column(String)
    student = relationship('Student', backref='enrollments')
    course = relationship('Course', backref='enrollments')

class Teacher(Base):
    __tablename__ = 'teachers'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    courses = relationship('Course', back_populates='teacher')


# Define the association table for the many-to-many relationship
student_course_association = Table('student_course_association', Base.metadata,
    Column('student_id', Integer, ForeignKey('students.id')),
    Column('course_id', Integer, ForeignKey('courses.id'))
)

# Create the tables in the database
Base.metadata.create_all(engine)

# Create a session
session = Session()

# Add some data to the database
student1 = Student(name='John', email='john@example.com')
profile1 = StudentProfile(address='123 Main St', date_of_birth=datetime.strptime('1995-01-01', '%Y-%m-%d').date())
student1.profile = profile1
teacher1 = Teacher(name='Jane', email='jane@example.com')
course1 = Course(name='Mathematics', teacher=teacher1)
student2 = Student(name='Alice', email='alice@example.com')
course2 = Course(name='Science', teacher=teacher1)
enrollment1 = Enrollment(student=student1, course=course1, grade='A')
enrollment2 = Enrollment(student=student1, course=course2, grade='B')
enrollment3 = Enrollment(student=student2, course=course1, grade='B')
session.add_all([student1, profile1, teacher1, course1, student2, course2, enrollment1, enrollment2, enrollment3])
session.commit()

# Perform the queries
# 1. To get the details of a specific student along with their profile information
student = session.query(Student).join(StudentProfile).filter(Student.id == 1).first()
print(f"Name: {student.name}, Email: {student.email}, Address: {student.profile.address}, Date of Birth: {student.profile.date_of_birth}")

# 2. To get the name and email of all the teachers who teach a specific course
teachers = session.query(Teacher).join(Course).filter(Course.name == 'Mathematics').all()
for teacher in teachers:
    print(f"Name: {teacher.name}, Email: {teacher.email}")

# 3.To get the names of all the students who have enrolled in a specific course:
students = session.query(Student).join(Enrollment).filter(Enrollment.course_id == 1).all()
for student in students:
    print(student.name)

# 4. To get the names of all the courses that a specific student has enrolled in:
courses = session.query(Course).join(Enrollment).filter(Enrollment.student_id == 1).all()
for course in courses:
    print(course.name)


