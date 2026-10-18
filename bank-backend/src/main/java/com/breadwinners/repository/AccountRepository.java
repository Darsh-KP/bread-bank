package com.breadwinners.repository;

import com.breadwinners.model.Account;
import com.breadwinners.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findAllByUser(User user);
    boolean existsByAccountNumberAndUser(Long accountNumber, User user);
    Optional<Account> findByAccountNumberAndUser(Long accountNumber, User user);
}
