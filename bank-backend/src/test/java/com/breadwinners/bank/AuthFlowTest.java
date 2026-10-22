package com.breadwinners.bank;

import com.breadwinners.dto.auth.*;
import com.breadwinners.model.*;
import com.breadwinners.exception.*;
import com.breadwinners.repository.*;
import com.breadwinners.service.*;
import com.breadwinners.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthFlowTest {
    @Mock
    UserRepository users;

    @Mock
    RefreshTokenRepository refreshTokens;

    @Mock
    PasswordEncoder passwords;

    @Test
    void billybakerCanRegister() {
        when(users.existsByUsername("billybaker")).thenReturn(false);
        when(users.existsByEmail("billybaker@example.com")).thenReturn(false);
        when(users.existsByPhone("1234567890")).thenReturn(false);
        when(passwords.encode("Password1")).thenReturn("hashed");

        RegisterResponse result = new AuthService(users, passwords, new JwtUtil()).register(new RegisterRequestDto("Billy", "Baker", "billybaker@example.com", "1234567890", "BillyBaker", "Password1"));

        assertEquals("billybaker", result.userResponse().username());
        verify(users).save(any(User.class));
    }

    @Test
    void duplicateBillyRegistrationIsRejected() {
        when(users.existsByUsername("billybaker")).thenReturn(true);

        assertThrows(DuplicateUserException.class, () -> new AuthService(users, passwords, new JwtUtil()).register(new RegisterRequestDto("Billy", "Baker", "billybaker@example.com", "1234567890", "BillyBaker", "Password1")));

        verify(users, never()).save(any());
    }

    @Test
    void billybakerCanLogin() {
        when(users.findByUsername("billybaker")).thenReturn(Optional.of(new User("billybaker", "hashed", "Billy", "Baker", "billybaker@example.com", "1234567890")));
        when(passwords.matches("Password1", "hashed")).thenReturn(true);

        LoginResponse result = new AuthService(users, passwords, new JwtUtil()).login(new LoginRequestDto("BillyBaker", "Password1"));

        assertEquals("billybaker", result.userResponse().username());
        assertTrue(new JwtUtil().validateToken(result.accessToken()));
    }

    @Test
    void wrongPasswordIsRejected() {
        when(users.findByUsername("billybaker")).thenReturn(Optional.of(new User("billybaker", "hashed", "Billy", "Baker", "billybaker@example.com", "1234567890")));
        when(passwords.matches("Wrong1", "hashed")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> new AuthService(users, passwords, new JwtUtil()).login(new LoginRequestDto("BillyBaker", "Wrong1")));
    }

    @Test
    void billybakerCanRefresh() {
        JwtUtil jwt = new JwtUtil();
        RefreshService service = new RefreshService(refreshTokens, jwt, users);

        when(refreshTokens.findByTokenHash(any())).thenReturn(Optional.of(new RefreshToken("billybaker", "hash", Instant.now().plusSeconds(60))));
        when(users.findByUsername("billybaker")).thenReturn(Optional.of(new User("billybaker", "hashed", "Billy", "Baker", "billybaker@example.com", "1234567890")));

        assertEquals("billybaker", service.refresh("valid-refresh-token").userResponse().username());
    }

    @Test
    void invalidJwtIsRejected() {
        JwtUtil jwt = new JwtUtil();

        assertFalse(jwt.validateToken("tampered-token"));
    }

    @Test
    void invalidRefreshTokenIsRejectedWithException() {
        when(refreshTokens.findByTokenHash(any())).thenReturn(Optional.empty());

        assertThrows(InvalidRefreshTokenException.class, () -> new RefreshService(refreshTokens, new JwtUtil(), users).refresh("invalid-refresh-token"));
    }
}
