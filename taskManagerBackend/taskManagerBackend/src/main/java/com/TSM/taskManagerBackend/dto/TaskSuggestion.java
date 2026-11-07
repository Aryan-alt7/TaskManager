package com.TSM.taskManagerBackend.dto;

import java.time.LocalDate;

public class TaskSuggestion {

    private String title;
    private String priority;
    private LocalDate dueDate;

    public TaskSuggestion() {
    }

    public TaskSuggestion(String title, String priority, LocalDate dueDate) {
        this.title = title;
        this.priority = priority;
        this.dueDate = dueDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}