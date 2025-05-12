package com.project.shopapp.responses;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeleteResponse {
    private String status;
    private String message;
}
