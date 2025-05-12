package com.project.shopapp.services;

import com.project.shopapp.dtos.OrderDTO;
import com.project.shopapp.models.Order;
import com.project.shopapp.responses.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IOrderService {
    Order createOrder(OrderDTO orderDTO) throws Exception;

    Order getOrderById(Long id) throws Exception;

    List<OrderResponse> getOrderByUserId(Long userId);

    List<OrderResponse> getAllOrders();

    OrderResponse updateOrder(Long id, OrderDTO orderDTO) throws Exception;

    void deleteOrder(Long id);

    Page<OrderResponse> getOrdersByKeyword(String keyword, Pageable pageable);
}
