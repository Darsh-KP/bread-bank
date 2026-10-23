package com.breadwinners.controller;

import com.breadwinners.dto.dashboardaccounts.AccountSummaryResponseDto;
import com.breadwinners.dto.dashboardaccounts.AllAccountsResponseDto;
import com.breadwinners.exception.GlobalExceptionHandler;
import com.breadwinners.exception.UserNotFoundException;
import com.breadwinners.service.DashboardAccountsService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;

import java.math.BigInteger;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
@ExtendWith(MockitoExtension.class)
class DashboardControllerTest {

    private static final String USERNAME = "breadboi";

    @Mock
    private DashboardAccountsService dashboardAccountsService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(new DashboardController(dashboardAccountsService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
                .build();
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void returnsAccountsForAuthenticatedUser() throws Exception {
        var account = new AccountSummaryResponseDto(
                100000000001L,
                "Everyday Checking",
                "Main account",
                new BigInteger("12550")
        );
        when(dashboardAccountsService.getAccountsForUser(USERNAME))
                .thenReturn(new AllAccountsResponseDto(List.of(account)));

        mockMvc.perform(get("/dashboard")
                        .principal(authenticatedAs()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accounts").isArray())
                .andExpect(jsonPath("$.accounts[0].accountNumber").value(100000000001L))
                .andExpect(jsonPath("$.accounts[0].marketingName").value("Everyday Checking"))
                .andExpect(jsonPath("$.accounts[0].nickname").value("Main account"))
                .andExpect(jsonPath("$.accounts[0].balanceInCents").value(12550));

        verify(dashboardAccountsService).getAccountsForUser(USERNAME);
    }

    @Test
    void returnsBadRequestWhenUserIsNotFound() throws Exception {
        when(dashboardAccountsService.getAccountsForUser(USERNAME))
                .thenThrow(new UserNotFoundException("User data does not exist."));

        mockMvc.perform(get("/dashboard")
                        .principal(authenticatedAs()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("User data does not exist."));

        verify(dashboardAccountsService).getAccountsForUser(USERNAME);
    }

    private Authentication authenticatedAs() {
        Authentication authentication =
                new UsernamePasswordAuthenticationToken(DashboardControllerTest.USERNAME, null, List.of());
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        return authentication;
    }
}