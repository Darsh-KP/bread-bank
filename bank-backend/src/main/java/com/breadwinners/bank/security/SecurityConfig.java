package com.breadwinners.bank.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        // Argon2id password encoder
        return new Argon2PasswordEncoder(
                16,
                32,
                2,
                131072,
                3
        );
    }
}
