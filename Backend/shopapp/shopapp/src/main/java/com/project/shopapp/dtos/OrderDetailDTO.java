package com.project.shopapp.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetailDTO {
    @JsonProperty("order_id")
    @Min(value = 1, message = "Order's Id must be larger than 0")
    private Long orderId;

    @JsonProperty("product_id")
    @Min(value = 1, message = "Product's Id must be larger than 0")
    private Long productId;

    @Min(value = 1, message = "Quantity must be larger than or equal 1")
    private Long quantity;

    @Min(value = 0, message = "Price must be larger than or equal 0")
    private Float price;

    @JsonProperty("total_money")
    @Min(value = 0, message = "Total money must be larger than or equal 0")
    private Float totalMoney;
}
