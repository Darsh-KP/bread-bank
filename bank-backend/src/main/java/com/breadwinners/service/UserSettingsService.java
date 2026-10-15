package com.breadwinners.service;

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
     * @param username Username parsed from JWT of user logged in.
     * @return User model object of current user logged-in, contains info to display to user.
     */
    public User loadUserInformation(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User data does not exist."));
    }

    /**
     * Given an update request, updates the provided fields
     * @param username Username parsed from JWT of user logged in.
     * @param request request to update one or more fields of a user's personal information.
     * @return User model object representing the update to their information.
     */
    public User updateUserField(String username, UserInformationUpdateRequestDto request) {

        User user = loadUserInformation(username);

        //If phone is provided, normalize it and if it is empty then user did not provide correct format.
        String normalizedPhone = request.phone().isEmpty() || request.phone().isBlank() ? null:
                Normalization.normalizePhone(request.phone());
        if(normalizedPhone != null && normalizedPhone.isEmpty()){
            throw new InvalidPhoneFormatException("Phone number must contain digits.");
        }

        String email = request.email().isEmpty() || request.email().isBlank() ? null :
                request.email();

        //Set first name to new value if provided.
        if(!request.firstName().isEmpty() && !request.firstName().isBlank()){
            user.setFirstName(request.firstName());
        }

        //Set last name to new value if provided.
        if(!request.lastName().isEmpty() && !request.lastName().isBlank()){
            user.setLastName(request.lastName());
        }

        //Check if phone number was provided and if it is unique
        if(normalizedPhone != null) {
            if(userRepository.existsByPhone(normalizedPhone)) {
                throw new DuplicatePhoneException("Phone number already taken by another user.");
            }
            user.setPhone(normalizedPhone);
        }

        //Check if email number was provided and if it is unique
        if(email != null){
            if(userRepository.existsByEmail(email)){
                throw new DuplicateEmailException("Email address already taken by another user.");
            }
            user.setEmail(email);
        }

        return userRepository.save(user);
    }

}
