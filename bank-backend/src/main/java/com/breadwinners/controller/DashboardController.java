package com.breadwinners.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.breadwinners.dtos.dashboardaccounts.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    // technically should have a service that should grab the information:
    // I need user information and account information
    private final UserSettingsService userSettingsService;

    // constructor injection
    @Autowired
    public DashboardController(UserSettingsService userSettingsService) {
        this.userSettingsService = userSettingsService;
    }

    @GetMapping
    public ResponseEntity<AllAccountsResponseDto> getAccounts(@RequestHeader("Authorization") String token) {
        User user = userSettingsService.getUserByToken(token);

        // using this user, grab its username to then grab its associated account information
        String username
    }
}