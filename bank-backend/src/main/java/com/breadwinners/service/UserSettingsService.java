package com.breadwinners.service;

import com.breadwinners.dto.auth.UserResponse;
import com.breadwinners.dto.userSettings.UserInformationUpdateRequestDto;
import com.breadwinners.exception.*;
import com.breadwinners.model.User;
import com.breadwinners.repository.UserRepository;
import com.breadwinners.util.Normalization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.breadwinners.util.Normalization.MAX_PHONE_LENGTH;
import static com.breadwinners.util.Normalization.MIN_PHONE_LENGTH;

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
     * @return User response object of current user logged-in, contains info to display to user.
     */
    public UserResponse loadUserInformation(String username) {
        if (username == null) {
            throw new UserNotFoundException("Invalid token or user not found.");
        }

        String normalizedUsername = username.trim().toLowerCase();

        User user = userRepository.findByUsername(normalizedUsername)
                .orElseThrow(() -> new UserNotFoundException("User data does not exist."));

        return new UserResponse(user.getUsername(), user.getFirstName(), user.getLastName(),
                user.getEmail(), user.getPhone());

    }

    /**
     * Private method to load whole user profile including password hash
     * @param username of logged in user
     * @return Whole user object of current user logged-in, contains info to display to user.
     */
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
            if (normalizedPhone.isEmpty() ||
                    normalizedPhone.length() < MIN_PHONE_LENGTH || normalizedPhone.length() > MAX_PHONE_LENGTH) {
                throw new InvalidPhoneFormatException("Phone number must contain only 10-14 digits.");
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
        if (request.firstName() != null) {
            if(request.firstName().isBlank()){
                throw new BlankFieldException("First name can not be blank");
            }
            user.setFirstName(request.firstName().trim());
        }

        //Set last name to new value if provided.
        if (request.lastName() != null) {
            if(request.lastName().isBlank()){
                throw new BlankFieldException("Last name can not be blank");
            }
            user.setLastName(request.lastName().trim());
        }

        userRepository.save(user);
    }

}
