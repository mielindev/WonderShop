package com.project.shopapp.configurations;

import com.project.shopapp.filters.JwtTokenFilter;
import com.project.shopapp.models.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {
    private final JwtTokenFilter jwtTokenFilter;

    @Value("${api.prefix}")
    private String apiPrefix;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        String formattedApiPrefix = apiPrefix + "/";
        httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(request -> {
                    request.requestMatchers(
                                    formattedApiPrefix + "users/login",
                                    formattedApiPrefix + "users/register"
                            )
                            .permitAll()

                            .requestMatchers(POST, formattedApiPrefix + "users/details").permitAll()
                            .requestMatchers(PUT, formattedApiPrefix + "user/details/{userId}").hasAnyRole(Role.ADMIN, Role.USER)
                            .requestMatchers(GET, formattedApiPrefix + "users").hasRole(Role.ADMIN)
                            .requestMatchers(DELETE, formattedApiPrefix + "users/{id}").hasRole(Role.ADMIN)
                            // Category Permit
                            .requestMatchers(GET, formattedApiPrefix + "categories/**").permitAll()
                            .requestMatchers(POST, formattedApiPrefix + "categories/**").hasRole(Role.ADMIN)
                            .requestMatchers(PUT, formattedApiPrefix + "categories/**").hasRole(Role.ADMIN)
                            .requestMatchers(DELETE, formattedApiPrefix + "categories/**").hasRole(Role.ADMIN)
                            // Products Permit
                            .requestMatchers(GET, formattedApiPrefix + "products/**").permitAll()
                            .requestMatchers(GET, formattedApiPrefix + "products/images/*").permitAll()
                            .requestMatchers(GET, formattedApiPrefix + "products/by-ids*").permitAll()
                            .requestMatchers(POST, formattedApiPrefix + "products/**").hasRole(Role.ADMIN)
                            .requestMatchers(POST, formattedApiPrefix + "products/uploads/**").hasRole(Role.ADMIN)
                            .requestMatchers(PUT, formattedApiPrefix + "products/**").hasRole(Role.ADMIN)
                            .requestMatchers(DELETE, formattedApiPrefix + "products/**").hasRole(Role.ADMIN)
                            // Orders Permit
                            .requestMatchers(GET, formattedApiPrefix + "orders").hasAnyRole(Role.ADMIN, Role.USER)
//                            .requestMatchers(GET, formattedApiPrefix + "orders/get-orders-by-keyword").hasRole(Role.ADMIN)
                            .requestMatchers(POST, formattedApiPrefix + "orders/**").hasRole(Role.USER)
                            .requestMatchers(PUT, formattedApiPrefix + "orders/**").hasRole(Role.ADMIN)
                            .requestMatchers(DELETE, formattedApiPrefix + "orders/**").hasRole(Role.ADMIN)
                            // Order-Details Permit
                            .requestMatchers(GET, formattedApiPrefix + "order-details/**").hasAnyRole(Role.ADMIN, Role.USER)
                            .requestMatchers(POST, formattedApiPrefix + "order-details").hasRole(Role.USER)
                            .requestMatchers(PUT, formattedApiPrefix + "order-details/**").hasRole(Role.ADMIN)
                            .requestMatchers(DELETE, formattedApiPrefix + "order-details/**").hasRole(Role.ADMIN)
                            .anyRequest().authenticated();
                });


        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200")); // frontend origin
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true); // allow cookies/auth headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}


