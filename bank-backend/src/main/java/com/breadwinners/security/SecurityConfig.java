package com.breadwinners.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtFilter jwtFilter;

    // Constructor injection for required dependencies
    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Argon2id password encoder
        return new Argon2PasswordEncoder(
                16,
                32,
                2,
                131072,
                3
        );
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Enable cors and link our cors config
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Disable CSRF protection to avoid unnecessary overhead
                .csrf(AbstractHttpConfigurer::disable)

                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, exception) ->
                                response.setStatus(401)))

                // Endpoint authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Public endpoint for authentication
                        .requestMatchers("/auth/**").permitAll()

                        // All other endpoints requires valid login
                        .anyRequest().authenticated()
                )

                // Inject out JWT filter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // Define a new cors config
        CorsConfiguration config = new CorsConfiguration();

        // Allow Angular site to make requests (by default port 4200 on localhost)
        config.setAllowedOrigins(List.of("http://localhost:4200"));

        // Allow the CRUD methods
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Set the headers the frontend is allowed to send
        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With"
        ));

        // Tell the browser to let frontend read the following headers
        config.setExposedHeaders(List.of("Authorization"));

        config.setAllowCredentials(true);

        // Apply cors config
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
