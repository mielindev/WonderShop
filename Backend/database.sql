-- Tạo database
CREATE DATABASE shopapp;
-- Chọn và chuyển đến database
USE shopapp;
-- Khách hàng muốn mua hàng => tạo tài khoản => bảng user
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(100) DEFAULT "",
    phone_number VARCHAR(10) NOT NULL,
    address VARCHAR(200) DEFAULT "",
    password VARCHAR(100) NOT NULL DEFAULT "",
    created_at DATETIME,
    updated_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    date_of_birth DATE,
    facebook_account_id INT DEFAULT 0,
    google_account_id INT DEFAULT 0
);
ALTER TABLE users
ADD COLUMN role_id INT;
ALTER TABLE users
ADD FOREIGN KEY (role_id) REFERENCES roles(id);
-- Tạo bảng roles
CREATE TABLE roles(
    id INT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);
CREATE TABLE tokens(
    id INT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(255) UNIQUE NOT NULL,
    token_type VARCHAR(50) NOT NULL,
    expiration_date DATETIME,
    revoked TINYINT(1) NOT NULL,
    expired TINYINT(1) NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
-- Hỗ trợ đăng nhập bằng facebook và google
CREATE TABLE social_account(
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `provider` VARCHAR(20) NOT NULL COMMENT 'Tên nhà cung cấp',
    `provider_id` VARCHAR(50) NOT NULL,
    `email` VARCHAR(150) NOT NULL COMMENT "Email tài khoản",
    `name` VARCHAR(100) NOT NULL COMMENT "Tên người dùng",
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Bảng danh mục sản phẩm (Categories)
CREATE TABLE categories (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL DEFAULT "" COMMENT "Tên danh mục sản phẩm",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Bảng sản phẩm (products)
CREATE TABLE products(
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) COMMENT "Tên sản phẩm",
    price FLOAT NOT NULL,
    thumbnail VARCHAR(300) DEFAULT "",
    description LONGTEXT DEFAULT "",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
CREATE TABLE product_images(
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_product_image_product_id FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
ALTER TABLE product_images
ADD COLUMN image_url VARCHAR(300);
ALTER TABLE products
ADD CONSTRAINT chk_price_positive CHECK (price >= 0);
-- Bảng đặt hàng - Orders
CREATE TABLE orders(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    fullname VARCHAR(100),
    email VARCHAR(100),
    phone_number VARCHAR(20) NOT NULL,
    address VARCHAR(200) NOT NULL,
    note VARCHAR(100) DEFAULT "",
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20),
    total_money FLOAT CHECK (total_money >= 0)
);
ALTER TABLE orders
ADD COLUMN `shipping_method` VARCHAR(100);
ALTER TABLE orders
ADD COLUMN `shipping_address` VARCHAR(200);
ALTER TABLE orders
ADD COLUMN `shipping_date` DATE;
ALTER TABLE orders
ADD COLUMN `tracking_number` VARCHAR(100);
ALTER TABLE orders
ADD COLUMN `payment_method` VARCHAR(100);
ALTER TABLE orders
ADD COLUMN is_active TINYINT(1);
ALTER TABLE orders
MODIFY COLUMN status ENUM(
        'pending',
        'processing',
        'delivering',
        'delivered',
        'failed',
        'refunded'
    ) COMMENT 'Trạng thái đơn hàng';
-- Bảng đặt hàng chi tiết (order_details)
CREATE TABLE order_details(
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES products(id),
    quantity INT CHECK (quantity > 0),
    price FLOAT CHECK(price >= 0),
    total_money FLOAT CHECK(total_money >= 0)
);