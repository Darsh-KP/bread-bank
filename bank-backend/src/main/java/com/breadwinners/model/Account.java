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
    @Min(0) @Max(100000000000L)
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

    @DecimalMin("0.0")
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


    /*
    CREATE TABLE accounts (
	account_number NUMERIC(12,0) CHECK (account_number >= 100000000000) PRIMARY KEY,
	account_type BIGINT NOT NULL,
	username VARCHAR(50) NOT NULL,
	nickname VARCHAR(50) DEFAULT NULL,
	balance NUMERIC(17,2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0.00),
	pin_hash VARCHAR(255) NOT NULL,
	creation_date TIMESTAMP NOT NULL DEFAULT NOW(),
	frozen_until TIMESTAMP DEFAULT NULL,

	FOREIGN KEY (username) REFERENCES users(username) ON DELETE RESTRICT ON UPDATE RESTRICT,
	FOREIGN KEY (account_type) REFERENCES account_type(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);
     */
}
