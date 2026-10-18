package com.breadwinners.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    // Constructor injection for required dependencies
    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        // Get the Auth header
        String authHeader = request.getHeader("Authorization");

        // Check if the Auth header is present and formatted correctly
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // Extract the jwt token
            String token = authHeader.substring(7);

            // Validate the token
            if (jwtUtil.validateToken(token)) {
                // Extract the logged-in username
                String username = jwtUtil.extractUsername(token);

                // Check if username is actually present and the request was not already authenticated
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Create the token wrapper
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    username,
                                    null,
                                    Collections.emptyList()
                            );

                    // Set the Auth to fulfill request
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
}