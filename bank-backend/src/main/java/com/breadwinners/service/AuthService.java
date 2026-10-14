package com.breadwinners.service;

import com.breadwinners.dto.auth.RegisterRequestDto;
import com.breadwinners.dto.auth.RegisterResponse;
import com.breadwinners.model.User;
import com.breadwinners.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public RegisterResponse register(RegisterRequestDto req) {
        String username = req.username().trim().toLowerCase();
        String email = req.email().trim().toLowerCase();
        String phone = normalizePhone(req.phone());
        String firstName = req.firstName().trim();
        String lastName = req.lastName().trim();

        if (phone.isEmpty()) {
            throw new IllegalArgumentException("Phone number must contain digits.");
        }

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists.");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists.");
        }
        if (userRepository.existsByPhone(phone)) {
            throw new IllegalArgumentException("Phone already exists.");
        }

        User user = new User(username, passwordEncoder.encode(req.password()), firstName, lastName, email, phone);
        userRepository.save(user);

        return new RegisterResponse(username, firstName, lastName, email, phone);
    }

    private String normalizePhone(String phone) {
        String digitsOnly = phone.trim().replaceAll("\\D", "");
        if (digitsOnly.length() == 11 && digitsOnly.startsWith("1")) {
            return digitsOnly.substring(1);
        }
        return digitsOnly;
    }
}
