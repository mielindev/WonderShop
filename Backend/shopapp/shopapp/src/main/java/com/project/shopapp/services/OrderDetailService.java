package com.project.shopapp.services;

import com.project.shopapp.dtos.OrderDetailDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Order;
import com.project.shopapp.models.OrderDetail;
import com.project.shopapp.models.Product;
import com.project.shopapp.repositories.OrderDetailRepository;
import com.project.shopapp.repositories.OrderRepository;
import com.project.shopapp.repositories.ProductRepository;
import com.project.shopapp.responses.OrderDetailResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailService implements IOrderDetailService {
    private final OrderDetailRepository orderDetailRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public OrderDetailResponse createOrderDetail(OrderDetailDTO orderDetailDTO) throws Exception {
        Order existingOrder = orderService.getOrderById(orderDetailDTO.getOrderId());
        Product existingProduct = productService.getProductById(orderDetailDTO.getProductId());
        OrderDetail orderDetail = OrderDetail.builder()
                .order(existingOrder)
                .product(existingProduct)
                .quantity(orderDetailDTO.getQuantity())
                .price(existingProduct.getPrice())
                .totalMoney(existingProduct.getPrice() * orderDetailDTO.getQuantity())
                .build();
        orderDetailRepository.save(orderDetail);
        Float total = 0f;
        for (OrderDetail detail : orderDetailRepository.findByOrderId(orderDetailDTO.getOrderId())) {
            total += detail.getTotalMoney();
        }

        existingOrder.setTotalMoney(total);
        orderRepository.save(existingOrder);
        return OrderDetailResponse.fromOrderDetail(orderDetail);
    }

    @Override
    public List<OrderDetailResponse> getOrderDetails() {
        return orderDetailRepository.findAll().stream().map(OrderDetailResponse::fromOrderDetail).toList();
    }

    @Override
    public List<OrderDetailResponse> getOrderDetailByOrderId(Long orderId) {
        return orderDetailRepository.findByOrderId(orderId).stream().map(OrderDetailResponse::fromOrderDetail).toList();
    }

    @Override
    @Transactional
    public OrderDetailResponse updateOrderDetail(Long id, OrderDetailDTO orderDetailDTO) throws Exception {
        OrderDetail orderDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("The order details was couldn't found with ID: " + id));
        if (orderDetail != null) {
            Order existingOrder = orderService.getOrderById(orderDetailDTO.getOrderId());
            Product existingProduct = productService.getProductById(orderDetailDTO.getProductId());
            orderDetail.setOrder(existingOrder);
            orderDetail.setProduct(existingProduct);
            orderDetail.setQuantity(orderDetailDTO.getQuantity());
            orderDetail.setPrice(existingProduct.getPrice());
            orderDetail.setTotalMoney(existingProduct.getPrice() * orderDetailDTO.getQuantity());
            orderDetailRepository.save(orderDetail);
            return OrderDetailResponse.fromOrderDetail(orderDetail);
        }
        return null;
    }

    @Override
    @Transactional
    public void deleteOrderDetail(Long id) {
        orderDetailRepository.findById(id).ifPresent(orderDetailRepository::delete);
    }
}
