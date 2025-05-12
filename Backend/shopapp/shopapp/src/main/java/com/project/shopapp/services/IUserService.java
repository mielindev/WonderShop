package com.project.shopapp.services;

import com.project.shopapp.dtos.UpdateUserDTO;
import com.project.shopapp.dtos.UserDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.User;
import com.project.shopapp.responses.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IUserService {
    User register(UserDTO userDTO) throws DataNotFoundException;

    String login(String phoneNumber, String password) throws Exception;

    User getUserByToken(String token) throws Exception;

    User updateUser(Long userId, UpdateUserDTO updateUserDTO) throws DataNotFoundException;

    Page<UserResponse> getAllUsers(String keyword, Pageable pageable, String token) throws Exception;

    void lockUser(Long UserId);
}
