package com.breadwinners.repository;

import com.breadwinners.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findAllByUsername(String username);
    Optional<Account> getAccountByUsernameAndNumber(String username, Long accountNumber);
}
