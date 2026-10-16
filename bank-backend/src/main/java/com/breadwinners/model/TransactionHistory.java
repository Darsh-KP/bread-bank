package com.breadwinners.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions_history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TransactionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @Column(name = "source_account", nullable = false)
    private Long sourceAccount;

    
    @Column(name = "destination_account")
    private Long destinationAccount;

   
    @Column(name = "instant", nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false, precision = 17, scale = 2)
    private BigDecimal amount;

    @Column(name = "source_balance_after", nullable = false, precision = 17, scale = 2)
    private BigDecimal sourceBalanceAfter;

    @Column(name = "destination_balance_after", precision = 17, scale = 2)
    private BigDecimal destinationBalanceAfter;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "transaction_type", nullable = false, columnDefinition = "single_transaction_type")
    private TransactionType transactionType;

    @Column(length = 50)
    private String description;

    public TransactionHistory(Long sourceAccount, Long destinationAccount, LocalDateTime createdAt,
                              BigDecimal amount, BigDecimal sourceBalanceAfter,
                              BigDecimal destinationBalanceAfter, TransactionType transactionType,
                              String description) {
        this.sourceAccount = sourceAccount;
        this.destinationAccount = destinationAccount;
        this.createdAt = createdAt;
        this.amount = amount;
        this.sourceBalanceAfter = sourceBalanceAfter;
        this.destinationBalanceAfter = destinationBalanceAfter;
        this.transactionType = transactionType;
        this.description = description;
    }
}