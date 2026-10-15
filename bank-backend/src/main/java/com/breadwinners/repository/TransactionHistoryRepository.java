package com.breadwinners.repository;

import com.breadwinners.model.TransactionHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, Long> {

    @Query("""
            select t from TransactionHistory t
            where t.sourceAccount = :accountNumber
               or t.destinationAccount = :accountNumber
            order by t.createdAt desc, t.id desc
            """)
    List<TransactionHistory> findHistoryByAccountNumber(
            @Param("accountNumber") Long accountNumber,
            Pageable pageable);
}
