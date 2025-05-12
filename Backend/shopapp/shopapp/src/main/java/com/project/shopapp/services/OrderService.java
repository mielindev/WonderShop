package com.project.shopapp.services;

import com.project.shopapp.dtos.CartItemDTO;
import com.project.shopapp.dtos.OrderDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.*;
import com.project.shopapp.repositories.OrderDetailRepository;
import com.project.shopapp.repositories.OrderRepository;
import com.project.shopapp.repositories.ProductRepository;
import com.project.shopapp.repositories.UserRepository;
import com.project.shopapp.responses.OrderDetailResponse;
import com.project.shopapp.responses.OrderResponse;
import com.project.shopapp.responses.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public Order createOrder(OrderDTO orderDTO) throws Exception {
        if (orderDTO == null) {
            throw new IllegalArgumentException("The order cannot be null or empty");
        }
        User existingUser = userRepository.findById(orderDTO.getUserId())
                .orElseThrow(() -> new DataNotFoundException("Cannot found the user with ID: " + orderDTO.getUserId()));
        // convert orderDTO to Order by modelMapper
        modelMapper.typeMap(OrderDTO.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setId));
        Order order = new Order();
        modelMapper.map(orderDTO, order);
        order.setUser(existingUser);
        order.setOrderDate(new Date());
        order.setStatus(OrderStatus.PENDING);
        order.setTotalMoney((float) 0);
        order.setShippingAddress(orderDTO.getShippingAddress() != null ? orderDTO.getShippingAddress() : orderDTO.getAddress());
        LocalDate shippingDate = orderDTO.getShippingDate() == null ? LocalDate.now() : orderDTO.getShippingDate();
        if (shippingDate.isBefore(LocalDate.now())) {
            throw new DataNotFoundException("Date must be at least today!");
        }
        order.setIsActive(true);
        orderRepository.save(order);

        List<OrderDetail> orderDetails = new ArrayList<>();
        for (CartItemDTO cartItemDTO : orderDTO.getCartItems()) {
            OrderDetail orderDetail = new OrderDetail();

            orderDetail.setOrder(order);

            Product product = productRepository.findById(cartItemDTO.getProductId())
                    .orElseThrow(() -> new DataNotFoundException("Product is not found with id:" + cartItemDTO.getProductId()));
            orderDetail.setProduct(product);
            orderDetail.setQuantity(cartItemDTO.getQuantity());
            orderDetail.setPrice(product.getPrice());
            orderDetail.setTotalMoney(product.getPrice() * cartItemDTO.getQuantity());

            orderDetails.add(orderDetail);
        }
        orderDetailRepository.saveAll(orderDetails);
        Float total = orderDetailRepository.getTotalMoneyByOrderId(order.getId());
        order.setTotalMoney(total != null ? total : 0f);
        orderRepository.save(order);
        return order;
    }

    @Override
    public Order getOrderById(Long id) throws Exception {
        return orderRepository.findById(id).orElse(null);
    }

    @Override
    public List<OrderResponse> getOrderByUserId(Long userId) {
        return orderRepository.findByUserId(userId).stream().map(OrderResponse::fromOrder).toList();
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream().map(OrderResponse::fromOrder).toList();
    }

    @Override
    @Transactional
    public OrderResponse updateOrder(Long id, OrderDTO orderDTO) throws Exception {
        Order existingOrder = getOrderById(id);
        User existingUser = userRepository.findById(orderDTO.getUserId())
                .orElseThrow(
                        () -> new DataNotFoundException("Couldn't find the user with ID: " + orderDTO.getUserId())
                );
        modelMapper.typeMap(OrderDTO.class, Order.class).addMappings(
                mapper -> mapper.skip(Order::setId)
        );
        modelMapper.map(orderDTO, existingOrder);
        existingOrder.setUser(existingUser);
        orderRepository.save(existingOrder);
        return OrderResponse.fromOrder(existingOrder);
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        Order existingOrder = orderRepository.findById(id).orElse(null);
        if (existingOrder != null) {
            existingOrder.setIsActive(false);
            orderRepository.save(existingOrder);
        }
    }

    @Override
    public Page<OrderResponse> getOrdersByKeyword(String keyword, Pageable pageable) {
        Page<Order> orderPages = orderRepository.getOrdersByKeyword(keyword, pageable);
        return orderPages.map(OrderResponse::fromOrder);
    }
}
