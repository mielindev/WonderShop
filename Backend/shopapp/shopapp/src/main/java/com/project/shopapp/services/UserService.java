package com.project.shopapp.services;

import com.project.shopapp.components.JwtTokenUtils;
import com.project.shopapp.components.LocalizationUtils;
import com.project.shopapp.dtos.UpdateUserDTO;
import com.project.shopapp.dtos.UserDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Role;
import com.project.shopapp.models.User;
import com.project.shopapp.repositories.RoleRepository;
import com.project.shopapp.repositories.UserRepository;
import com.project.shopapp.responses.UserResponse;
import com.project.shopapp.utils.MessageKeys;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final JwtTokenUtils jwtTokenUtils;
    private final AuthenticationManager authenticationManager;
    private final LocalizationUtils localizationUtils;


    @Override
    @Transactional
    public User register(UserDTO userDTO) throws DataNotFoundException {
        String phoneNumber = userDTO.getPhoneNumber();
        boolean exitsUser = userRepository.existsByPhoneNumber(phoneNumber);
        if (exitsUser) {
            throw new DataIntegrityViolationException(
                    localizationUtils.getLocalizationMessage(MessageKeys.PHONE_EXISTED)
            );
        }
        User newUser = User.builder()
                .fullName(userDTO.getFullName())
                .phoneNumber(userDTO.getPhoneNumber())
                .address(userDTO.getAddress())
                .password(userDTO.getPassword())
                .isActive(true)
                .dateOfBirth(userDTO.getDateOfBirth() != null ? userDTO.getDateOfBirth() : LocalDate.of(1990, 12, 1))
                .facebookAccountId(userDTO.getFacebookAccountId())
                .googleAccountId(userDTO.getGoogleAccountId())
                .build();
        Role role = roleRepository.findById(1L)
                .orElseThrow(() -> new DataNotFoundException(localizationUtils.getLocalizationMessage(MessageKeys.NOT_FOUND_ROLE)
                ));

        newUser.setRole(role);
        if (userDTO.getFacebookAccountId() == 0 && userDTO.getGoogleAccountId() == 0) {
            String password = userDTO.getPassword();
            String passwordEncoded = passwordEncoder.encode(password);
            newUser.setPassword(passwordEncoded);
        }
        userRepository.save(newUser);
        return newUser;
    }

    @Override
    public String login(String phoneNumber, String password) throws Exception {
        Optional<User> optionalUser = userRepository.findByPhoneNumber(phoneNumber);
        if (optionalUser.isEmpty()) {
            throw new DataNotFoundException(
                    localizationUtils.getLocalizationMessage(MessageKeys.WRONG_PHONE_PASSWORD)
            );
        }
        User existingUser = optionalUser.get();
        // check password
        if (existingUser.getFacebookAccountId() == 0 && existingUser.getGoogleAccountId() == 0) {
            if (!passwordEncoder.matches(password, existingUser.getPassword())) {
                throw new BadCredentialsException(
                        localizationUtils.getLocalizationMessage(MessageKeys.WRONG_PHONE_PASSWORD)
                );
            }
        }

        if (!existingUser.getIsActive()) {
            throw new Exception("User is locked");
        }

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                phoneNumber, password,
                existingUser.getAuthorities()
        );
        //authenticate with JAVA Spring security
        authenticationManager.authenticate(authenticationToken);
        return jwtTokenUtils.generateToken(existingUser);
    }

    @Override
    public User getUserByToken(String token) throws Exception {
        if (jwtTokenUtils.isTokenExpired(token)) {
            throw new Exception("Token was expired");
        }
        String phoneNumber = jwtTokenUtils.extractPhoneNumber(token);
        Optional<User> user = userRepository.findByPhoneNumber(phoneNumber);
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new DataNotFoundException("User is not found");
        }
    }

    @Override
    @Transactional
    public User updateUser(Long userId, UpdateUserDTO updateDTO) throws DataNotFoundException {
        // 🔍 1. Find the existing user
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("User not found"));

        // 👤 2. Update user details (excluding phone number)
        if (updateDTO.getFullName() != null) {
            existingUser.setFullName(updateDTO.getFullName());
        }
        if (updateDTO.getAddress() != null) {
            existingUser.setAddress(updateDTO.getAddress());
        }
        if (updateDTO.getDateOfBirth() != null) {
            existingUser.setDateOfBirth(updateDTO.getDateOfBirth());
        }

        // 🌐 3. Update social account IDs
        if (updateDTO.getFacebookAccountId() > 0) {
            existingUser.setFacebookAccountId(updateDTO.getFacebookAccountId());
        }
        if (updateDTO.getGoogleAccountId() > 0) {
            existingUser.setGoogleAccountId(updateDTO.getGoogleAccountId());
        }

        // 🔐 4. Password change logic
        if (updateDTO.getOldPassword() != null && updateDTO.getNewPassword() != null) {
            boolean isOldPasswordCorrect = passwordEncoder.matches(updateDTO.getOldPassword(), existingUser.getPassword());
            if (!isOldPasswordCorrect) {
                throw new DataIntegrityViolationException("Old password is incorrect");
            }
            existingUser.setPassword(passwordEncoder.encode(updateDTO.getNewPassword()));
        }

        // 💾 5. Save and return updated user
        return userRepository.save(existingUser);
    }

    @Override
    public Page<UserResponse> getAllUsers(String keyword, Pageable pageable, String token) throws Exception {
        User loggedInUser = getUserByToken(token);
        Page<User> users = userRepository.getAllUsers(keyword, pageable, loggedInUser.getId());
        return users.map(UserResponse::fromUser);
    }

    @Override
    public void lockUser(Long UserId) {
        User existingUser = userRepository.findById(UserId).orElse(null);
        if (existingUser != null) {
            existingUser.setIsActive(false);
            userRepository.save(existingUser);
        }
    }
}
