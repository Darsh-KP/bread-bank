package com.breadwinners.dto.userSettings;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserInformationUpdateRequestDto(

    @Size(max = 30, message = "First name can not be over 30 characters")
    String firstName,

    @Size(max = 30, message = "Last name can not be over 30 characters")
    String lastName,

    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        message = "Provided email is not of a valid form.")
    @Size(max = 254, message = "Email can not be over 254 characters long.")
    String email,

    @Pattern(regexp = "^\\d+$", message = "Phone number can only contain digits.")
    @Size(max = 20, message = "Phone number can not be over 20 digits long.")
    String phone
){}
