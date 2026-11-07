
package com.TSM.taskManagerBackend.service;

import com.TSM.taskManagerBackend.dto.TaskSuggestion;
import com.TSM.taskManagerBackend.model.Task;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AIService {

    private final ChatClient chatClient;
    private final TaskService taskService;

    public AIService(ChatClient.Builder builder, TaskService taskService) {
        this.chatClient = builder.build();
        this.taskService = taskService;
    }

    public List<TaskSuggestion> generateTasks(String prompt) {
        return chatClient.prompt()
                .system("""
                            You are an AI task planning assistant.
                            Generate useful and realistic tasks based on the user's request.
    
                            For every task:
                            - Give a short, clear title.
                            - Set priority to HIGH, MEDIUM, or LOW.
                            - Set a valid due date in YYYY-MM-DD format.
                            - Return only tasks relevant to the user's request.
                            """)
                .user(prompt)
                .call()
                .entity(new ParameterizedTypeReference<List<TaskSuggestion>>() {});
    }

    public Task saveSuggestedTask(int projId, TaskSuggestion suggestion) {
        Task task = new Task();
        task.setTitle(suggestion.getTitle());
        task.setPriority(suggestion.getPriority());
        task.setDueDate(suggestion.getDueDate());
        task.setCompleted(false);

        return taskService.createTask(projId, task);
    }
}
