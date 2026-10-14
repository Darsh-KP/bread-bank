package com.breadwinners.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.context.annotation.Role;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
public class Account {
    @Min(100000000000L)
    @Column
    long accountNumber;

    @Min(0)
    @Column
    long accountType;

    @NotEmpty @Length(max = 50)
    @Column
    String username;

    @Length(max = 50)
    @Column
    String nickname;

    @DecimalMin("0.0") @DecimalMax("99999999999999.99")
    @Column
    BigDecimal balance;

    @NotEmpty @Length(max = 255)
    @Column
    String pinHash;

    @NotNull
    @Column
    Instant creationDate;

    @Column
    Instant frozenUntil;
}
