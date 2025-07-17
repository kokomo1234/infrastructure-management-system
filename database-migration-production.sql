-- =====================================================
-- PRODUCTION DATABASE MIGRATION
-- Infrastructure Management System Enhancement
-- =====================================================
-- This migration enhances the existing schema to support
-- both current and new frontend requirements

-- =====================================================
-- STEP 1: ENHANCE EXISTING TABLES
-- =====================================================

-- Enhance TDL table with site management fields
ALTER TABLE `TDL` 
ADD COLUMN IF NOT EXISTS `name` VARCHAR(255) NOT NULL DEFAULT 'Site TDL' AFTER `region`,
ADD COLUMN IF NOT EXISTS `class` VARCHAR(10) NOT NULL DEFAULT '1' AFTER `name`,
ADD COLUMN IF NOT EXISTS `phase` VARCHAR(50) NOT NULL DEFAULT 'Triphasé' AFTER `class`,
ADD COLUMN IF NOT EXISTS `voltage` VARCHAR(50) NOT NULL DEFAULT '347/600' AFTER `phase`,
ADD COLUMN IF NOT EXISTS `power_factor` DECIMAL(3,2) NOT NULL DEFAULT 0.95 AFTER `voltage`,
ADD COLUMN IF NOT EXISTS `status` VARCHAR(50) NOT NULL DEFAULT 'Actif' AFTER `power_factor`,
ADD COLUMN IF NOT EXISTS `contact_person` VARCHAR(255) NULL AFTER `status`,
ADD COLUMN IF NOT EXISTS `contact_phone` VARCHAR(50) NULL AFTER `contact_person`,
ADD COLUMN IF NOT EXISTS `contact_email` VARCHAR(255) NULL AFTER `contact_phone`,
ADD COLUMN IF NOT EXISTS `total_capacity_kw` DECIMAL(10,2) NULL AFTER `contact_email`,
ADD COLUMN IF NOT EXISTS `used_capacity_kw` DECIMAL(10,2) NULL AFTER `total_capacity_kw`,
ADD COLUMN IF NOT EXISTS `remaining_capacity_kw` DECIMAL(10,2) NULL AFTER `used_capacity_kw`,
ADD COLUMN IF NOT EXISTS `emergency_percentage` INT DEFAULT 80 AFTER `remaining_capacity_kw`,
ADD COLUMN IF NOT EXISTS `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER `emergency_percentage`,
ADD COLUMN IF NOT EXISTS `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`;

-- Fix TDL data types
ALTER TABLE `TDL`
MODIFY COLUMN `adresse` VARCHAR(255) NOT NULL,
MODIFY COLUMN `ville` VARCHAR(255) NOT NULL,
MODIFY COLUMN `code_postal` VARCHAR(20) NOT NULL;

-- Enhance TSF table similarly
ALTER TABLE `TSF`
ADD COLUMN IF NOT EXISTS `name` VARCHAR(255) NOT NULL DEFAULT 'Site TSF' AFTER `region`,
ADD COLUMN IF NOT EXISTS `class` VARCHAR(10) NOT NULL DEFAULT '2' AFTER `name`,
ADD COLUMN IF NOT EXISTS `phase` VARCHAR(50) NOT NULL DEFAULT 'Monophasé' AFTER `class`,
ADD COLUMN IF NOT EXISTS `voltage` VARCHAR(50) NOT NULL DEFAULT '120/240' AFTER `phase`,
ADD COLUMN IF NOT EXISTS `power_factor` DECIMAL(3,2) NOT NULL DEFAULT 0.93 AFTER `voltage`,
ADD COLUMN IF NOT EXISTS `status` VARCHAR(50) NOT NULL DEFAULT 'Actif' AFTER `power_factor`,
ADD COLUMN IF NOT EXISTS `total_capacity_kw` DECIMAL(10,2) NULL AFTER `status`,
ADD COLUMN IF NOT EXISTS `used_capacity_kw` DECIMAL(10,2) NULL AFTER `total_capacity_kw`,
ADD COLUMN IF NOT EXISTS `emergency_percentage` INT DEFAULT 80 AFTER `used_capacity_kw`,
ADD COLUMN IF NOT EXISTS `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER `emergency_percentage`,
ADD COLUMN IF NOT EXISTS `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`;

-- Fix TSF data types
ALTER TABLE `TSF`
MODIFY COLUMN `adresse` VARCHAR(255) NOT NULL;

-- Enhance AC table with advanced equipment tracking
ALTER TABLE `AC`
ADD COLUMN IF NOT EXISTS `current_load` DECIMAL(10,2) DEFAULT 0 AFTER `output_ac`,
ADD COLUMN IF NOT EXISTS `pair_id` VARCHAR(255) NULL AFTER `current_load`,
ADD COLUMN IF NOT EXISTS `is_redundant` BOOLEAN DEFAULT FALSE AFTER `pair_id`,
ADD COLUMN IF NOT EXISTS `efficiency` DECIMAL(5,2) NULL AFTER `is_redundant`,
ADD COLUMN IF NOT EXISTS `manufacturer` VARCHAR(255) NULL AFTER `efficiency`,
ADD COLUMN IF NOT EXISTS `installation_date` DATE NULL AFTER `manufacturer`,
ADD COLUMN IF NOT EXISTS `last_maintenance` DATE NULL AFTER `installation_date`,
ADD COLUMN IF NOT EXISTS `next_maintenance` DATE NULL AFTER `last_maintenance`,
ADD COLUMN IF NOT EXISTS `specifications` JSON NULL AFTER `next_maintenance`,
ADD COLUMN IF NOT EXISTS `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER `specifications`,
ADD COLUMN IF NOT EXISTS `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`;

-- Fix AC data types (ensure TDL_id is VARCHAR for consistency)
ALTER TABLE `AC`
MODIFY COLUMN `TSF_id` VARCHAR(10) NULL,
MODIFY COLUMN `date_inst` DATE NULL,
MODIFY COLUMN `modèle` VARCHAR(255) NULL,
MODIFY COLUMN `no_série` VARCHAR(255) NULL;

-- =====================================================
-- STEP 2: CREATE NEW MANAGEMENT TABLES
-- =====================================================

-- Users table for authentication and management
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100) NULL,
  `last_name` VARCHAR(100) NULL,
  `display_name` VARCHAR(255) NULL,
  `phone` VARCHAR(50) NULL,
  `department` VARCHAR(100) NULL,
  `position` VARCHAR(100) NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `last_login` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Work orders for maintenance and repairs
CREATE TABLE IF NOT EXISTS `work_orders` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `priority` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  `status` ENUM('draft', 'open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
  `type` VARCHAR(100) NULL,
  `site_id` VARCHAR(10) NULL,
  `site_type` ENUM('TDL', 'TSF') NULL,
  `equipment_type` VARCHAR(50) NULL,
  `equipment_id` BIGINT UNSIGNED NULL,
  `assigned_to` VARCHAR(36) NULL,
  `created_by` VARCHAR(36) NOT NULL,
  `scheduled_date` TIMESTAMP NULL,
  `due_date` TIMESTAMP NULL,
  `completed_date` TIMESTAMP NULL,
  `estimated_hours` DECIMAL(5,2) NULL,
  `actual_hours` DECIMAL(5,2) NULL,
  `cost` DECIMAL(10,2) NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- STEP 3: ADD PERFORMANCE INDEXES
-- =====================================================

-- Add indexes for better performance (only if they don't exist)
ALTER TABLE `TDL` ADD INDEX IF NOT EXISTS `idx_tdl_region` (`region`);
ALTER TABLE `TDL` ADD INDEX IF NOT EXISTS `idx_tdl_status` (`status`);
ALTER TABLE `TSF` ADD INDEX IF NOT EXISTS `idx_tsf_region` (`region`);
ALTER TABLE `AC` ADD INDEX IF NOT EXISTS `idx_ac_tdl` (`TDL_id`);
ALTER TABLE `AC` ADD INDEX IF NOT EXISTS `idx_ac_type` (`type`);
ALTER TABLE `DC` ADD INDEX IF NOT EXISTS `idx_dc_tdl` (`TDL_id`);
ALTER TABLE `GEN_TSW` ADD INDEX IF NOT EXISTS `idx_gen_tsw_tdl` (`TDL_id`);
ALTER TABLE `HVAC` ADD INDEX IF NOT EXISTS `idx_hvac_tdl` (`TDL_id`);
ALTER TABLE `Besoin` ADD INDEX IF NOT EXISTS `idx_besoin_tdl` (`TDL_id`);
ALTER TABLE `work_orders` ADD INDEX IF NOT EXISTS `idx_work_orders_status` (`status`);
ALTER TABLE `work_orders` ADD INDEX IF NOT EXISTS `idx_work_orders_site` (`site_id`, `site_type`);

-- =====================================================
-- STEP 4: UPDATE EXISTING DATA
-- =====================================================

-- Update TDL names with meaningful values
UPDATE `TDL` SET `name` = CONCAT('Site TDL ', `id`) WHERE `name` = 'Site TDL';

-- Update TSF names with meaningful values
UPDATE `TSF` SET `name` = CONCAT('Site TSF ', `id`) WHERE `name` = 'Site TSF';

-- Calculate capacity values where possible
UPDATE `TDL` t SET 
  `total_capacity_kw` = (
    SELECT COALESCE(SUM(a.output_ac), 0) / 1000 
    FROM `AC` a WHERE a.TDL_id = t.id
  ),
  `used_capacity_kw` = t.charge_ac / 1000
WHERE `total_capacity_kw` IS NULL;

UPDATE `TDL` SET 
  `remaining_capacity_kw` = `total_capacity_kw` - `used_capacity_kw`
WHERE `remaining_capacity_kw` IS NULL 
  AND `total_capacity_kw` IS NOT NULL 
  AND `used_capacity_kw` IS NOT NULL;

-- =====================================================
-- MIGRATION COMPLETED
-- =====================================================
/*
This migration enhances the existing infrastructure management database
to support both the current frontend and the new modern frontend.

Key enhancements:
✅ Enhanced TDL and TSF tables with site management fields
✅ Enhanced AC table with advanced equipment tracking
✅ Added users management system
✅ Added work orders system
✅ Added performance indexes
✅ Updated existing data with calculated values
✅ Maintained all existing functionality
✅ Ready for French localization
✅ Supports compact AC equipment display
✅ Compatible with both current and new frontends
*/
