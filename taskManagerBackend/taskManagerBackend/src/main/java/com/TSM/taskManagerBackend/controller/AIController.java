package com.TSM.taskManagerBackend.controller;

import com.TSM.taskManagerBackend.dto.TaskSuggestion;
import com.TSM.taskManagerBackend.model.Task;
import com.TSM.taskManagerBackend.service.AIService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.TSM.taskManagerBackend.dto.AIRequest;

import java.util.List;

@RestController
@RequestMapping("/ai")
@CrossOrigin
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/generate-tasks")
    public List<TaskSuggestion> generateTasks(@RequestBody AIRequest request) {
        return aiService.generateTasks(request.getPrompt());
    }

    @PostMapping("/projects/{projId}/save-task")
    public ResponseEntity<Task> saveSuggestedTask(@PathVariable Integer projId, @RequestBody TaskSuggestion suggestion) {
        Task task = aiService.saveSuggestedTask(projId, suggestion);
        if(task == null)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(task, HttpStatus.CREATED);
    }
}