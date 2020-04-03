package loc.eldar.demo.controllers;

import loc.eldar.demo.models.Student;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("students")
public class StudentController {

    @GetMapping
    public List<Student> getAllStudents() {
        return List.of(
                new Student(UUID.randomUUID(), "First", "User", "test1@test.com", Student.Gender.MALE),
                new Student(UUID.randomUUID(), "Second", "User", "test2@test.com", Student.Gender.FEMALE)
        );
    }
}
