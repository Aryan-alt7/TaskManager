package com.TSM.taskManagerBackend.controller;

import com.TSM.taskManagerBackend.model.Project;
import com.TSM.taskManagerBackend.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService service;

    ProjectController(ProjectService service) {
        this.service = service;
    }

    @GetMapping("/")
    public ResponseEntity<List<Project>> getAll() {
        return new ResponseEntity<>(service.getAllProjects(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getById(@PathVariable int id) {
        Project project = service.getProjectById(id);
        if(project == null)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        else
            return new ResponseEntity<>(project, HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<Project> createProject(@Valid @RequestBody Project project) {
        return new ResponseEntity<>(service.createProject(project), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable int id
                                                ,@Valid @RequestBody Project project) {

        Project upd = service.updateById(id, project);
        if(upd == null)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        else
            return new ResponseEntity<>(upd, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable int id) {
        Project project = service.getProjectById(id);
        if(project == null)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        service.deleteProject(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
