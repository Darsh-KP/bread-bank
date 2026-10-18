package com.breadwinners.service;

import com.breadwinners.dto.userSettings.UserInformationUpdateRequestDto;
import com.breadwinners.exception.DuplicateEmailException;
import com.breadwinners.exception.DuplicatePhoneException;
import com.breadwinners.exception.InvalidPhoneFormatException;
import com.breadwinners.exception.UserNotFoundException;
import com.breadwinners.model.User;
import com.breadwinners.repository.UserRepository;
import com.breadwinners.security.JwtUtil;
import com.breadwinners.util.Normalization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserSettingsService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserSettingsService(UserRepository userRepository, JwtUtil jwtUtil){
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Loads current user information given a username
     * @param token JWT of logged-in user
     * @return User model object of current user logged-in, contains info to display to user.
     */
    public User loadUserInformation(String token) {
        String username = jwtUtil.extractUsername(token);
        if (username == null) {
            throw new UserNotFoundException("Invalid token or user not found.");
        }

        String normalizedUsername = username.trim().toLowerCase();

        return userRepository.findByUsername(normalizedUsername)
                .orElseThrow(() -> new UserNotFoundException("User data does not exist."));
    }

    /**
     * Given an update request, updates the provided fields
     * @param token JWT of logged-in user
     * @param request request to update one or more fields of a user's personal information.
     */
    public void updateUserField(String token, UserInformationUpdateRequestDto request) {

        User user = loadUserInformation(token);

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
