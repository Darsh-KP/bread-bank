package com.breadwinners.controller;

import com.breadwinners.dto.dashboardaccounts.AllAccountsResponseDto;
import com.breadwinners.service.DashboardAccountsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    private final DashboardAccountsService dashboardAccountsService;

    public DashboardController(DashboardAccountsService dashboardAccountsService) {
        this.dashboardAccountsService = dashboardAccountsService;
    }

    @GetMapping
    public ResponseEntity<AllAccountsResponseDto> getAccounts(
            @AuthenticationPrincipal String username
    ) {
        return ResponseEntity.ok(
                dashboardAccountsService.getAccountsForUser(username)
        );
    }
}