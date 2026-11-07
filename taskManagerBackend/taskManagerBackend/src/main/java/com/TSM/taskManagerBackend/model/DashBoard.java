
package com.TSM.taskManagerBackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashBoard {

    private long totalProjects;
    private long totalTasks;
    private long completedTasks;
    private long dueToday;
}

