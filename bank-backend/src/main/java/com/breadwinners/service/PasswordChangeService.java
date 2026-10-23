package com.breadwinners.service;

import com.breadwinners.dto.userSettings.UserPasswordUpdateRequestDto;
import com.breadwinners.exception.AccountNotFoundException;
import com.breadwinners.exception.ReusedPasswordException;
import com.breadwinners.model.User;
import com.breadwinners.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordChangeService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public PasswordChangeService(UserRepository userRepository,
                                 PasswordEncoder passwordEncoder
                                 ){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Method which takes a request from a currently logged-in user, changes
     * their password if old password matches current in database
     * and if new password is different from old.
     * @param username of logged-in user
     * @param request  User password change request (old password, new password)
     */
    public void changePassword(String username, UserPasswordUpdateRequestDto request){

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AccountNotFoundException("User with the provided username, could not be found"));

        //Check if current password matches old, if not throw error
        if(!passwordEncoder.matches(request.oldPassword(), user.getPasswordHash())){
            throw new BadCredentialsException("Incorrect current password provided");
        }

        //Check if new password matches old and if so throw error
        if(passwordEncoder.matches(request.newPassword(), user.getPasswordHash())){
            throw new ReusedPasswordException("New password can not be the same as the current password.");
        }

        //Encode new password before setting/saving to database.
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));

        userRepository.save(user);
    }

}