package com.project.shopapp.repositories;

import com.project.shopapp.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByPhoneNumber(String phoneNumber);

    Optional<User> findByPhoneNumber(String phoneNumber);

    @Query("""
            SELECT u FROM User u
            WHERE u.isActive = true
            AND u.id != :loggedInUserId
            AND (:keyword IS NULL OR :keyword = '' OR u.fullName LIKE %:keyword%
            OR u.phoneNumber LIKE %:keyword%
            OR u.address LIKE %:keyword%)
            """)
    Page<User> getAllUsers(@Param("keyword") String keyword,
                           Pageable pageable,
                           @Param("loggedInUserId") Long loggedInUserId);
}
