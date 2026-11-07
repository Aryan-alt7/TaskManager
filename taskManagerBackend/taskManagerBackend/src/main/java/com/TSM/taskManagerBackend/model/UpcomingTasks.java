package com.TSM.taskManagerBackend.model;


import java.time.LocalDate;

public class UpcomingTasks {

    private Integer id;
    private String title;
    private String priority;
    private boolean completed;
    private LocalDate dueDate;
    private Integer projectId;

    public UpcomingTasks(Integer id, String title, String priority,
                        boolean completed, LocalDate dueDate, Integer projectId) {
        this.id = id;
        this.title = title;
        this.priority = priority;
        this.completed = completed;
        this.dueDate = dueDate;
        this.projectId = projectId;
    }

    public Integer getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getPriority() {
        return priority;
    }

    public boolean isCompleted() {
        return completed;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public Integer getProjectId() {
        return projectId;
    }
}