package com.breadwinners.repository;

import com.breadwinners.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findAllByUsername(String username);
    boolean existsByAccountNumberAndUsername(Long accountNumber, String username);
}
