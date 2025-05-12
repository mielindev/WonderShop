package com.project.shopapp.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductImageDTO {
    @JsonProperty("product_id")
    @NotBlank(message = "Product's Id is required")
    private Long productId;

    @JsonProperty("image_url")
    @Size(min = 5, max = 200, message = "Image url's length must have at least 5 to 200 characters")
    private String imageUrl;
}
