from sqlalchemy import create_engine, Table, Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
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

