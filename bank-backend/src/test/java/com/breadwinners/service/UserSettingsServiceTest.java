package com.breadwinners.service;

import com.breadwinners.dto.auth.UserResponse;
import com.breadwinners.dto.userSettings.UserInformationUpdateRequestDto;
import com.breadwinners.exception.DuplicateEmailException;
import com.breadwinners.exception.DuplicatePhoneException;
import com.breadwinners.exception.UserNotFoundException;
import com.breadwinners.model.User;
import com.breadwinners.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserSettingsServiceTest {

    private User user;

    @Mock
    private UserRepository userRepo;

    @InjectMocks
    private UserSettingsService service;

    @BeforeEach
    void setup(){

    }

    void createMockUser(){
        String username = "itsYaBreadBoi";
        String firstName = "Iakkhos";
        String lastName = "Bread";
        String email = "example@email.com";
        String phone = "7320001234";
        user = new User(username, "passHash", firstName,
                lastName, email, phone);
    }

    UserResponse createUserResponse(User user){
        return new UserResponse(user.getUsername(), user.getFirstName(),
                user.getLastName(), user.getEmail(), user.getPhone());
    }

    @Test
    void positiveLoadUserInformation(){

        createMockUser();

        when(userRepo.findByUsername(user.getUsername().toLowerCase())).thenReturn(Optional.of(user));

        UserResponse expected = createUserResponse(user);
        UserResponse actual = service.loadUserInformation(user.getUsername());

        assertEquals(expected, actual);
    }

    @Test
    void userDoesNotExistLoadUserInformation(){

        String nonExistingUsername = "iDontExist";
        String message = "User data does not exist.";

        when(userRepo.findByUsername(nonExistingUsername.toLowerCase()))
                .thenThrow(new UserNotFoundException(message));

        UserNotFoundException e = assertThrows(UserNotFoundException.class,
                () -> service.loadUserInformation(nonExistingUsername));
        assertEquals(message, e.getMessage());
    }

    @Test
    void userNotLoggedInLoadUserInformation(){

        String message = "Invalid token or user not found.";

        UserNotFoundException e = assertThrows(UserNotFoundException.class,
                () -> service.loadUserInformation(null));
        assertEquals(message, e.getMessage());
    }

    @Test
    void positiveUpdateUserField(){

        createMockUser();
        String newName = "Newbert";

        when(userRepo.findByUsername(user.getUsername().toLowerCase())).thenReturn(Optional.of(user));
        when(userRepo.save(user)).thenReturn(user);

        UserInformationUpdateRequestDto request = new UserInformationUpdateRequestDto(newName,
                null, null, null);

        service.updateUserField(user.getUsername(), request);

        verify(userRepo, times(1)).findByUsername(user.getUsername().toLowerCase());
        verify(userRepo, times(1)).save(user);
    }


    @Test
    void updateUserField_ThrowsDuplicatePhoneException() {

        createMockUser();

        String username = user.getUsername();
        // Setup a user with an initial phone number
        user.setPhone("7320001234");

        // Request a *different* phone number that already exists in the system
        UserInformationUpdateRequestDto request = new UserInformationUpdateRequestDto(
                 null, null, null, "7329999999"
        );

        // Mock finding the user and mock that the phone already exists in the repo
        when(userRepo.findByUsername(username.toLowerCase())).thenReturn(Optional.of(user));
        when(userRepo.existsByPhone("7329999999")).thenReturn(true);

        // Assert that the exception is thrown
        DuplicatePhoneException exception = assertThrows(
                DuplicatePhoneException.class,
                () -> service.updateUserField(username, request)
        );

        assertEquals("Phone number already taken by another user.", exception.getMessage());

        // Ensure save was never triggered due to the failure
        verify(userRepo, never()).save(any(User.class));
    }

    @Test
    void updateUserField_ThrowsDuplicateEmailException() {
        createMockUser();

        String username = user.getUsername();
        // Setup a user with an initial email
        user.setEmail("current@email.com");

        // Request a *different* email that already exists in the system
        UserInformationUpdateRequestDto request = new UserInformationUpdateRequestDto(
                null, null, "taken@email.com", null
        );

        // Mock finding the user and mock that the email already exists in the repo
        when(userRepo.findByUsername(username.toLowerCase())).thenReturn(Optional.of(user));
        when(userRepo.existsByEmail("taken@email.com")).thenReturn(true);

        // Assert that the exception is thrown
        DuplicateEmailException exception = assertThrows(
                DuplicateEmailException.class,
                () -> service.updateUserField(username, request)
        );

        assertEquals("Email address already taken by another user.", exception.getMessage());

        // Ensure save was never triggered
        verify(userRepo, never()).save(any(User.class));
    }

}
