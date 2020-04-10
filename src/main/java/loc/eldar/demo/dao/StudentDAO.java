package loc.eldar.demo.dao;

import loc.eldar.demo.models.Student;
import loc.eldar.demo.models.StudentCourse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class StudentDAO {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public StudentDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Student> selectAllStidents() {
        String sql = "select * from student";

        List<Student> students = this.jdbcTemplate.query(sql, getStudentRowMapper());

        return students;
    }

    public int insertStudent(UUID newStudentId, Student student) {
        String sql = "insert into student (student_id, first_name, last_name, email, gender)" +
                        "values (?, ?, ?, ?, ?::gender)";
        return this.jdbcTemplate.update(sql, newStudentId, student.getFirstName(), student.getLastName(), student.getEmail(), student.getGender().name().toUpperCase());
    }

    public boolean isEmailTaken(String email) {
        String sql = "select exists (select 1 from student where email = ?)";
        return this.jdbcTemplate.queryForObject(sql, new Object[] {email}, (resultSet, i) -> resultSet.getBoolean(1));
    }

    public List<StudentCourse> selectAllStidentCourses(UUID studentId) {
        String sql = "" +
                "select " +
                "   student.student_id, course.course_id, course.name, course.description, course.department, course.teacher_name, " +
                "   student_course.start_date, student_course.end_date, student_course.grade " +
                "from student " +
                "join student_course using (student_id) " +
                "join course using (course_id) " +
                "where student.student_id = ?";
        return this.jdbcTemplate.query(sql, new Object[]{studentId}, getStudentCourseRowMapper());
    }

    private RowMapper<Student> getStudentRowMapper() {
        return (resultSet, i) -> {
            String studentIdStr = resultSet.getString("student_id");
            UUID studentId = UUID.fromString(studentIdStr);

            String firstName = resultSet.getString("first_name");
            String lastName = resultSet.getString("last_name");
            String email = resultSet.getString("email");

            String genderStr = resultSet.getString("gender");
            Student.Gender gender = Student.Gender.valueOf(genderStr);

            return new Student(studentId, firstName, lastName, email, gender);
        };
    }

    private RowMapper<StudentCourse> getStudentCourseRowMapper() {
        return (resultSet, i) -> {
            String studentIdStr = resultSet.getString("student_id");
            UUID studentId = UUID.fromString(studentIdStr);

            String courseIdStr = resultSet.getString("course_id");
            UUID courseId = UUID.fromString(courseIdStr);

            return new StudentCourse(studentId, courseId, resultSet.getString("name"), resultSet.getString("description"),
                    resultSet.getString("department"), resultSet.getString("teacher_name"),
                    resultSet.getDate("start_date").toLocalDate(), resultSet.getDate("end_date").toLocalDate(),
                    Optional.ofNullable(resultSet.getString("grade")).map(Integer::parseInt).orElse(null));
        };
    }
}
