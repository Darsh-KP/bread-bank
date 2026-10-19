package com.breadwinners.service;

import com.breadwinners.dto.auth.UserResponse;
import com.breadwinners.dto.userSettings.UserInformationUpdateRequestDto;
import com.breadwinners.exception.DuplicateEmailException;
import com.breadwinners.exception.DuplicatePhoneException;
import com.breadwinners.exception.InvalidPhoneFormatException;
import com.breadwinners.exception.UserNotFoundException;
import com.breadwinners.model.User;
import com.breadwinners.repository.UserRepository;
import com.breadwinners.util.Normalization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserSettingsService {

    private final UserRepository userRepository;

    @Autowired
    public UserSettingsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    /**
     * Loads current user information given a username
     * @param username of logged in user
     * @return User model object of current user logged-in, contains info to display to user.
     */
    public UserResponse loadUserInformation(String username) {
        if (username == null) {
            throw new UserNotFoundException("Invalid token or user not found.");
        }

        String normalizedUsername = username.trim().toLowerCase();

        User user = userRepository.findByUsername(normalizedUsername)
                .orElseThrow(() -> new UserNotFoundException("User data does not exist."));

        return new UserResponse(user.getUsername(), user.getFirstName(), user.getLastName(),
                user.getLastName(), user.getPhone());

    }

    private User loadAllUserInformation(String username) {
        if (username == null) {
            throw new UserNotFoundException("Invalid token or user not found.");
        }

        String normalizedUsername = username.trim().toLowerCase();

        return userRepository.findByUsername(normalizedUsername)
                .orElseThrow(() -> new UserNotFoundException("User data does not exist."));
    }

    /**
     * Given an update request, updates the provided fields
     * @param username of logged in user
     * @param request request to update one or more fields of a user's personal information.
     */
    public void updateUserField(String username, UserInformationUpdateRequestDto request) {

        User user = loadAllUserInformation(username);

        //If phone is provided, normalize it and if it is empty then user did not provide correct format.
        if (request.phone() != null && !request.phone().isBlank()) {
            String normalizedPhone = Normalization.normalizePhone(request.phone());
            if (normalizedPhone.isEmpty()) {
                throw new InvalidPhoneFormatException("Phone number must contain digits.");
            }
            //Check if phone is taken by other user
            if (!normalizedPhone.equals(user.getPhone())) {
                if (userRepository.existsByPhone(normalizedPhone)) {
                    throw new DuplicatePhoneException("Phone number already taken by another user.");
                }
                user.setPhone(normalizedPhone);
            }
        }

        //Check if email is provided or is blank before processing
        if (request.email() != null && !request.email().isBlank()) {
            String email = request.email().trim().toLowerCase();
            //Check if email is taken by other user
            if (!email.equals(user.getEmail())) {
                if (userRepository.existsByEmail(email)) {
                    throw new DuplicateEmailException("Email address already taken by another user.");
                }
                user.setEmail(email);
            }
        }

        //Set first name to new value if provided.
        if (request.firstName() != null && !request.firstName().isBlank()) {
            user.setFirstName(request.firstName().trim());
        }

        //Set last name to new value if provided.
        if (request.lastName() != null && !request.lastName().isBlank()) {
            user.setLastName(request.lastName().trim());
        }

        userRepository.save(user);
    }

}
