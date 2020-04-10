package loc.eldar.demo.services;

import loc.eldar.demo.dao.StudentDAO;
import loc.eldar.demo.exception.ApiRequestException;
import loc.eldar.demo.models.Student;
import loc.eldar.demo.models.StudentCourse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StudentService {

    private final StudentDAO studentDAO;

    @Autowired
    public StudentService(StudentDAO studentDAO) {
        this.studentDAO = studentDAO;
    }

    public List<Student> getAllStudents() {
        return this.studentDAO.selectAllStidents();
    }

    public void addNewStudent(Student student) {
        addNewStudent(null, student);
    }

    public void addNewStudent(UUID studentId, Student student) {
        UUID newStudentId = Optional.ofNullable(studentId).orElse(UUID.randomUUID());

        if (this.studentDAO.isEmailTaken(student.getEmail())) {
            throw new ApiRequestException(student.getEmail() + " is taken");
        }

        studentDAO.insertStudent(newStudentId, student);
    }

    public List<StudentCourse> getAllCoursesForStudent(UUID studentId) {
        return studentDAO.selectAllStidentCourses(studentId);
    }
}
