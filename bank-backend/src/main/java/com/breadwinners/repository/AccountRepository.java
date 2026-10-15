package com.breadwinners.repository;

import com.breadwinners.model.Account;
import com.breadwinners.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.util.*;

@Repository
public interface AccountRepository extends JpaRepository<Account, BigInteger> {
    List<Account> findAllByUser(User user);
    boolean existsByAccountNumberAndUser(BigInteger accountNumber, User user);
}
