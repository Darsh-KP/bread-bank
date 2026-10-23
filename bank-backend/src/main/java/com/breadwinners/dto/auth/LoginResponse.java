package com.breadwinners.dto.auth;

public record LoginResponse(UserResponse userResponse, String accessToken) {}