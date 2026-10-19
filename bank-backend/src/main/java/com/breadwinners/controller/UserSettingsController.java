package com.breadwinners.controller;

import com.breadwinners.dto.auth.UserResponse;
import com.breadwinners.dto.userSettings.UserInformationUpdateRequestDto;
import com.breadwinners.dto.userSettings.UserPasswordUpdateRequestDto;
import com.breadwinners.service.PasswordChangeService;
import com.breadwinners.service.UserSettingsService;
import com.breadwinners.util.Normalization;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/profile-settings")
public class UserSettingsController {

    private final UserSettingsService userSettingsService;
    private final PasswordChangeService passwordChangeService;

    @Autowired
    public UserSettingsController(UserSettingsService userSettingsService,
                                  PasswordChangeService passwordChangeService) {
        this.userSettingsService = userSettingsService;
        this.passwordChangeService = passwordChangeService;
    }

    //Loads user information, username is parsed from the JWT in the Authorization header
    @GetMapping
    public ResponseEntity<UserResponse> getUserInformation(
            Principal principal){

        UserResponse user = userSettingsService.loadUserInformation(principal.getName());

        return ResponseEntity.ok().body(user);
    }

    //Updates the user's first name, last name, email or phone
    //Field path variable is normalized in response method
    @PatchMapping("/{field}")
    public ResponseEntity<String> updateUserInformation(@Valid
                                                      @RequestBody UserInformationUpdateRequestDto request,
                                                      @PathVariable String field,
                                                      Principal principal){

        userSettingsService.updateUserField(principal.getName(), request);
        String message = "User " + Normalization.camelToTwoWords(field) + " successfully updated.";
        return ResponseEntity.ok().body(message);
    }

    //Updates user's password
    //Concrete field value of password given for this path, since it will always be password.
    @PatchMapping("/password")
    public ResponseEntity<String> updateUserInformation(@Valid @RequestBody UserPasswordUpdateRequestDto request,
                                                      Principal principal){

        passwordChangeService.changePassword(principal.getName(), request);
        String message = "User password successfully updated";
        return ResponseEntity.ok().body(message);
    }

}
