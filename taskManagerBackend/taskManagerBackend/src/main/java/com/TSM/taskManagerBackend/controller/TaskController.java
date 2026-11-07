package com.TSM.taskManagerBackend.controller;

import com.TSM.taskManagerBackend.model.Task;
import com.TSM.taskManagerBackend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class TaskController {

    private final TaskService service;

    TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getAll(
            @RequestParam(required = false) String order) {

            return new ResponseEntity<>(service.getAll(),HttpStatus.OK);

    }

    @GetMapping("/projects/{projId}/tasks")
    public ResponseEntity<Page<Task>> getTasksByProject(
            @PathVariable int projId,
            Pageable pageable) {

        return new ResponseEntity<>(
                service.getTasksByProject(projId, pageable),
                HttpStatus.OK
        );
    }
    @GetMapping("/tasks/{id}")
    public ResponseEntity<Task> getById(@PathVariable int id) {

        Task task = service.getById(id);

        if (task == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(task, HttpStatus.OK);
    }

    @PostMapping("/projects/{projId}/tasks")
    public ResponseEntity<Task> createTask(
            @PathVariable int projId,
            @Valid @RequestBody Task task) {

        if (task == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Task createdTask = service.createTask(projId, task);

        if (createdTask == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(
                createdTask,
                HttpStatus.CREATED
        );
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable int id,
            @Valid @RequestBody Task t) {

        Task task = service.updateTask(id, t);

        if (task == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(task, HttpStatus.OK);
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable int id) {

        service.deleteTask(id);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}