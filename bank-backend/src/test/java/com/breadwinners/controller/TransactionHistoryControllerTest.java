package com.breadwinners.controller;

import com.breadwinners.dto.transactionhistory.TransactionHistoryItemDto;
import com.breadwinners.dto.transactionhistory.TransactionHistoryResponseDto;
import com.breadwinners.dto.transactionhistory.TransactionHistoryType;
import com.breadwinners.exception.AccountNotFoundException;
import com.breadwinners.service.TransactionHistoryService;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TransactionHistoryControllerTest {

    private final TransactionHistoryService service = mock(TransactionHistoryService.class);
    private final MockMvc mvc = MockMvcBuilders
            .standaloneSetup(new TransactionHistoryController(service)).build();
    private final Authentication auth = new UsernamePasswordAuthenticationToken("breadboi", null, List.of());

    @Test
    void returnsHistoryAsJson() throws Exception {
        // createdAt is left null so this test does not depend on date serialization setup
        var item = new TransactionHistoryItemDto("1", TransactionHistoryType.TRANSFER_OUT,
                new BigDecimal("120.00"), new BigDecimal("3295.50"), "To Baker Billy", null);
        when(service.getHistory(eq("breadboi"), eq(100000000001L), eq(10)))
                .thenReturn(new TransactionHistoryResponseDto(List.of(item)));

        mvc.perform(post("/transaction-history")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountNumber\":100000000001,\"limit\":10}")
                        .principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactions[0].type").value("TRANSFER_OUT"))
                .andExpect(jsonPath("$.transactions[0].description").value("To Baker Billy"));
    }

    @Test
    void missingAccountNumberIs400() throws Exception {
        mvc.perform(post("/transaction-history")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"limit\":10}")
                        .principal(auth))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(service);
    }

    @Test
    void limitAbove1000Is400() throws Exception {
        mvc.perform(post("/transaction-history")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountNumber\":100000000001,\"limit\":2000}")
                        .principal(auth))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(service);
    }

    @Test
    void limitBelow1Is400() throws Exception {
        mvc.perform(post("/transaction-history")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountNumber\":100000000001,\"limit\":0}")
                        .principal(auth))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(service);
    }

    @Test
    void emptyBodyIs400() throws Exception {
        mvc.perform(post("/transaction-history")
                        .contentType(MediaType.APPLICATION_JSON)
                        .principal(auth))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(service);
    }

    @Test
    void unknownAccountIs404WithMessage() throws Exception {
        when(service.getHistory(any(), any(), any()))
                .thenThrow(new AccountNotFoundException("No account found for the given account number."));

        mvc.perform(post("/transaction-history")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountNumber\":999999999999}")
                        .principal(auth))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No account found for the given account number."));
    }
}