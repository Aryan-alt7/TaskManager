package com.TSM.taskManagerBackend.controller;

import com.TSM.taskManagerBackend.model.Users;
import com.TSM.taskManagerBackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/register")
    public Users createUser(@RequestBody Users user) {
        return service.createUser(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody Users user) {
        return service.login(user);
    }
}
