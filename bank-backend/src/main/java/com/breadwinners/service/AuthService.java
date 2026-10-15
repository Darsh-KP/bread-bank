package com.breadwinners.service;

import com.breadwinners.dto.auth.*;
import com.breadwinners.exception.*;
import com.breadwinners.model.User;
import com.breadwinners.repository.UserRepository;
import com.breadwinners.security.JwtUtil;

import com.breadwinners.util.Normalization;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public RegisterResponse register(RegisterRequestDto req) {
        String username = req.username().trim().toLowerCase();
        String email = req.email().trim().toLowerCase();
        String phone = Normalization.normalizePhone(req.phone());
        String firstName = req.firstName().trim();
        String lastName = req.lastName().trim();

        if (phone.isEmpty()) {
            throw new InvalidRegistrationException("Phone number must contain digits.");
        }

        if (userRepository.existsByUsername(username)) {
            throw new DuplicateUserException("Username already exists.");
        }
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateUserException("Email already exists.");
        }
        if (userRepository.existsByPhone(phone)) {
            throw new DuplicateUserException("Phone already exists.");
        }

        User user = new User(username, passwordEncoder.encode(req.password()), firstName, lastName, email, phone);
        userRepository.save(user);

        return new RegisterResponse(new UserResponse(username, firstName, lastName, email, phone));
    }

    public LoginResponse login(LoginRequestDto req) {
        String username = req.username().trim().toLowerCase();
        String password = req.password();

        User u = userRepository.findByUsername(username).orElseThrow(() -> new BadCredentialsException("Invalid username or password"));
        if (passwordEncoder.matches(password, u.getPasswordHash())) {
            return new LoginResponse(new UserResponse(u.getUsername(), u.getFirstName(), u.getLastName(), u.getEmail(), u.getPhone()), jwtUtil.generateToken(username));
        }

        throw new BadCredentialsException("Invalid username or password");
    }
}
