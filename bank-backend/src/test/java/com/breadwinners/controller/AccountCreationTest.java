package com.breadwinners.controller;

import com.breadwinners.service.AccountCreationService;
import com.breadwinners.service.AccountTypeService;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class AccountCreationTest {
    private final AccountCreationService acs = mock(AccountCreationService.class);
    private final AccountTypeService ats = mock(AccountTypeService.class);
    private final MockMvc mvc = MockMvcBuilders.standaloneSetup(new AccountCreationController(this.acs, this.ats)).build();
    private final Authentication auth = new UsernamePasswordAuthenticationToken("breadboi", null, List.of());

    @Test
    void badPin() throws Exception {
        mvc.perform(post("/create-account")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"accountType\": \"Sourdough Savings\", \"nickname\": \"\", \"pin\": \"aaaa\"}")
                .principal(this.auth))
                .andExpect(status().is4xxClientError());

        verifyNoInteractions(this.acs);
    }

    /*@Test
    void goodAccount() throws Exception {
        mvc.perform(post("/create-account")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"accountType\": \"Plain Checking\", \"nickname\": \"\", \"pin\": \"1234\"}")
                .principal(this.auth))
                .andExpect(status().is2xxSuccessful());

        verify(this.ats);
    }*/
}
