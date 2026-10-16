package com.breadwinners.dto.auth;

public record RefreshResponse(String accessToken, UserResponse userResponse) {
    
}
