package com.TSM.taskManagerBackend.service;

import com.TSM.taskManagerBackend.model.Project;
import com.TSM.taskManagerBackend.model.Users;
import com.TSM.taskManagerBackend.repo.ProjectRepo;
import com.TSM.taskManagerBackend.repo.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepo repo;
    private final UsersRepo usersRepo;

    public ProjectService(ProjectRepo repo, UsersRepo usersRepo) {
        this.repo = repo;
        this.usersRepo = usersRepo;
    }

    public List<Project> getAllProjects() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return repo.findUserByUser_Username(username);
    }

    public Project getProjectById(int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return repo.findByIdAndUser_Username(id, username).orElse(null);
    }

    public Project createProject(Project project) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Users user = usersRepo.findUserByUsername(username);
        project.setUser(user);
        return repo.save(project);
    }

    public  void deleteProject(Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Project project = repo.findByIdAndUser_Username(id, username).orElse(null);
        if (project == null) return;

        repo.deleteById(id);
    }

    public Project updateById(int id, Project project) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Project project1 = repo.findByIdAndUser_Username(id, username).orElse(null);
        if(project1 == null) return null;

        project1.setTitle(project.getTitle());
        project1.setDescription(project.getDescription());
        project1.setDueDate((project.getDueDate()));
        project1.setCompleted(project.isCompleted());

        return repo.save(project1);
    }
}
