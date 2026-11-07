package com.TSM.taskManagerBackend.service;

import com.TSM.taskManagerBackend.model.UserPrincipal;
import com.TSM.taskManagerBackend.model.Users;
import com.TSM.taskManagerBackend.repo.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UsersRepo repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("Username:" + username);
        Users user = repo.findUserByUsername(username);
        if(user == null) {
            System.out.println("user not found");
            throw new UsernameNotFoundException("user not found");
        }
        System.out.println("User found:" +user);

        return new UserPrincipal(user);
    }
}
