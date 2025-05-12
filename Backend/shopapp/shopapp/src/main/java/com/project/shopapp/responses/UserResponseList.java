package com.project.shopapp.responses;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserResponseList {
    private List<UserResponse> users;
    private int totalPages;
}
