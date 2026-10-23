package com.breadwinners.controller;

import com.breadwinners.dto.auth.UserResponse;
import com.breadwinners.dto.userSettings.UserInformationUpdateRequestDto;
import com.breadwinners.exception.DuplicateEmailException;
import com.breadwinners.exception.GlobalExceptionHandler;
import com.breadwinners.exception.UserNotFoundException;
import com.breadwinners.service.PasswordChangeService;
import com.breadwinners.service.UserSettingsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.security.Principal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
        import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
        import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UserSettingsControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserSettingsService userSettingsService;

    @Mock
    private PasswordChangeService passwordChangeService;

    @InjectMocks
    private UserSettingsController userSettingsController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userSettingsController)
                .setControllerAdvice(new GlobalExceptionHandler()) // <-- Pass an instance of your global exception handler class here!
                .build();
    }


    @Test
    public void getUserInformationPositive() throws Exception {
        String username = "itsYaBreadBoi";
        UserResponse mockResponse = new UserResponse(
                username,
                "Iakkhos",
                "Bread",
                "example@email.com",
                "7320001234"
        );

        when(userSettingsService.loadUserInformation(username)).thenReturn(mockResponse);

        // Perform GET request passing a mocked Principal
        mockMvc.perform(get("/profile-settings")
                        .principal((Principal) () -> username))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(username))
                .andExpect(jsonPath("$.firstName").value("Iakkhos"))
                .andExpect(jsonPath("$.email").value("example@email.com"));

        verify(userSettingsService, times(1)).loadUserInformation(username);
    }

    @Test
    public void getUserInformationNegativeUserNotFoundThrowsBadRequest() throws Exception {
        String username = "ghostUser";

        // Simulate the service throwing your UserNotFoundException
        doThrow(new UserNotFoundException("User not found."))
                .when(userSettingsService)
                .loadUserInformation(username);

        // Perform GET request and assert 400 Bad Request status + message body
        mockMvc.perform(get("/profile-settings")
                        .principal((Principal) () -> username))
                .andExpect(status().isBadRequest()) // Expects 400
                .andExpect(jsonPath("$.message").value("User not found."));

        verify(userSettingsService, times(1)).loadUserInformation(username);
    }

    @Test
    public void updateUserInformationPositivePhone() throws Exception {
        String username = "itsYaBreadBoi";
        String field = "phone";

        UserInformationUpdateRequestDto request = new UserInformationUpdateRequestDto(
                null, null, null, "7320001234"
        );

        // Because updateUserField is a void method, Mockito's default behavior
        // is to do nothing, which is exactly what we want for a successful run.

        mockMvc.perform(patch("/profile-settings/{field}", field)
                        .principal((Principal) () -> username)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User phone successfully updated."));

        verify(userSettingsService, times(1)).updateUserField(eq(username), any(UserInformationUpdateRequestDto.class));
    }

    @Test
    public void updateUserInformationNegativeServiceThrowsException() throws Exception {
        String username = "itsYaBreadBoi";
        String field = "email";
        String message = "Email address already taken by another user.";

        UserInformationUpdateRequestDto request = new UserInformationUpdateRequestDto(
                null, null, "taken@email.com", null
        );

        // Simulate the service throwing a custom exception
        doThrow(new DuplicateEmailException(message))
                .when(userSettingsService)
                .updateUserField(eq(username), any(UserInformationUpdateRequestDto.class));

        // Perform PATCH request
        mockMvc.perform(patch("/profile-settings/{field}", field)
                        .principal((Principal) () -> username)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict()) // Expects 409
                .andExpect(jsonPath("$.message").value(message));

        verify(userSettingsService).updateUserField(eq(username), any(UserInformationUpdateRequestDto.class));
    }
}
