-- =====================================================
-- ADD USERS TABLE TO EXISTING DATABASE
-- Infrastructure Management System Authentication
-- =====================================================

-- Create users table for authentication system
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `department` VARCHAR(100) NULL,
    `position` VARCHAR(100) NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `last_login` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_department` (`department`),
    INDEX `idx_users_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create work_orders table for work order management
CREATE TABLE IF NOT EXISTS `work_orders` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `status` ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    `assigned_to` VARCHAR(36) NULL,
    `created_by` VARCHAR(36) NOT NULL,
    `site_id` CHAR(2) NULL,
    `equipment_type` VARCHAR(50) NULL,
    `equipment_id` BIGINT UNSIGNED NULL,
    `scheduled_date` DATE NULL,
    `completed_date` DATE NULL,
    `estimated_hours` DECIMAL(5,2) NULL,
    `actual_hours` DECIMAL(5,2) NULL,
    `notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_work_orders_status` (`status`),
    INDEX `idx_work_orders_priority` (`priority`),
    INDEX `idx_work_orders_assigned_to` (`assigned_to`),
    INDEX `idx_work_orders_created_by` (`created_by`),
    INDEX `idx_work_orders_site_id` (`site_id`),
    FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`site_id`) REFERENCES `TDL`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial admin user
INSERT INTO `users` (
    `id`, 
    `email`, 
    `password_hash`, 
    `first_name`, 
    `last_name`, 
    `department`, 
    `position`, 
    `is_active`, 
    `created_at`, 
    `updated_at`
) VALUES (
    UUID(),
    'admin@infrastructure.com',
    '$2a$12$rQJ8vHmVKGZOQGKGKGKGKOeHiHiHiHiHiHiHiHiHiHiHiHiHiHiHi', -- This will be replaced by actual hash
    'Admin',
    'System',
    'Administration',
    'System Administrator',
    TRUE,
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE
    `updated_at` = NOW();

-- Show confirmation
SELECT 'Users table and initial admin user created successfully!' as message;
