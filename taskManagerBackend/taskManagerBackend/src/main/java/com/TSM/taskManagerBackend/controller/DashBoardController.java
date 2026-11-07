
package com.TSM.taskManagerBackend.controller;

import com.TSM.taskManagerBackend.model.DashBoard;
import com.TSM.taskManagerBackend.model.UpcomingTasks;
import com.TSM.taskManagerBackend.service.DashBoardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin
public class DashBoardController {

    private final DashBoardService service;

    public DashBoardController(DashBoardService service) {
        this.service = service;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashBoard> getStats() {

        return new ResponseEntity<>(
                service.getStats(),
                HttpStatus.OK
        );
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<UpcomingTasks>> getUpcomingTasks() {
        return new ResponseEntity<>(
                service.getUpcomingTasks(),
                HttpStatus.OK
        );
    }

    @GetMapping("/username")
    public String getUsername() {
        return service.getUsername();
    }
}