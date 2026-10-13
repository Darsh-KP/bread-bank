package com.breadwinners.dto.AccountView;

import com.breadwinners.dto.AccountCreation.AccountType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

import java.math.BigDecimal;
import java.time.Instant;

/* This DTO is intended for use both on the dashboard
 * and on the account summary page. */

public record AccountSummary(
        @NotNull Long accountNumber,
        AccountType accountType,
        @Length(max = 50) String nickname,
        @NotNull @DecimalMin("0.0") BigDecimal balance,
        Instant frozenUntil
) {}
