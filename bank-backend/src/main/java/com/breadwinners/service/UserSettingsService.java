package com.breadwinners.service;

import com.breadwinners.dto.userSettings.UserInformationRequestDto;
import com.breadwinners.dto.userSettings.UserInformationUpdateRequestDto;
import com.breadwinners.exception.DuplicateEmailException;
import com.breadwinners.exception.DuplicatePhoneException;
import com.breadwinners.exception.UserNotFoundException;
import com.breadwinners.model.User;
import com.breadwinners.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserSettingsService {

    private final UserRepository userRepository;

    @Autowired
    public UserSettingsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    //Internal loadUserInformation method, will delete/alter after jwt/services to get username
    private User loadUserInformation(String username){
        UserInformationRequestDto internalDto = new UserInformationRequestDto(username);
        return loadUserInformation(internalDto);
    }

    //External loadUserInformation method, will alter after jwt/services to get username.
    public User loadUserInformation(UserInformationRequestDto request) {
        return userRepository.findByUsername(request.username())
                .orElseThrow(() -> new UserNotFoundException("User data does not exist."));
    }

    //Given an update request, updates the provided fields
    public User updateUserField(UserInformationUpdateRequestDto request) {
        User user = loadUserInformation(request.username());

        //TODO Normalize Phone
        String normalizedPhone = request.phone().isEmpty() || request.phone().isBlank() ? null:
                request.phone();

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
