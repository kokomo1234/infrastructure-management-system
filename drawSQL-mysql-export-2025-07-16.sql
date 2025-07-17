CREATE TABLE `TDL`(
    `id` CHAR(2) NOT NULL,
    `region` VARCHAR(255) NOT NULL,
    `SDS` BOOLEAN NOT NULL,
    `esp_plan` FLOAT(53) NOT NULL,
    `nb_cab` BIGINT NOT NULL,
    `charge_ac` BIGINT NOT NULL,
    `charge_dc` BIGINT NOT NULL,
    `charge_gen` BIGINT NOT NULL,
    `charge_clim` BIGINT NOT NULL,
    `adresse` BIGINT NOT NULL,
    `ville` BIGINT NOT NULL,
    `code_postal` BIGINT NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `TSF`(
    `id` CHAR(2) NOT NULL,
    `region` VARCHAR(255) NOT NULL,
    `salle` BOOLEAN NOT NULL,
    `salle_id` INT NOT NULL AUTO_INCREMENT,
    `esp_plan` FLOAT(53) NOT NULL,
    `nb_cab` BIGINT NOT NULL,
    `charge_ac` BIGINT NOT NULL,
    `charge_dc` BIGINT NOT NULL,
    `charge_gen` BIGINT NOT NULL,
    `charge_clim` BIGINT NOT NULL,
    `adresse` BIGINT NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `AC`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL COMMENT 'OND or UPS',
    `output_ac` BIGINT NOT NULL,
    `TDL_id` BIGINT NOT NULL,
    `TSF_id` BIGINT NOT NULL,
    `Paire_id` BIGINT NOT NULL,
    `port_sw` VARCHAR(255) NOT NULL,
    `gateway` VARCHAR(255) NOT NULL,
    `netmask` VARCHAR(255) NOT NULL,
    `date_inst` BIGINT NOT NULL,
    `voltage` BIGINT NOT NULL,
    `phase` BIGINT NOT NULL,
    `puissance_tot` BIGINT NOT NULL,
    `Bypass` VARCHAR(255) NOT NULL,
    `commentaire` VARCHAR(255) NOT NULL,
    `ING` BIGINT NOT NULL,
    `modèle` BIGINT NOT NULL,
    `no_série` BIGINT NOT NULL,
    `fournisseur_id` BIGINT NOT NULL,
    `fabricant_id` BIGINT NOT NULL,
    `ip` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `OOD` BOOLEAN NOT NULL,
    `SLA` BIGINT NOT NULL
);
CREATE TABLE `DC`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `type` VARCHAR(255) NOT NULL COMMENT 'Batteries, CBDB ou Système DC',
    `output_dc` BIGINT NOT NULL,
    `TDL_id` BIGINT NOT NULL,
    `TSF_id` BIGINT NOT NULL
);
CREATE TABLE `GEN_TSW`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `type` VARCHAR(255) NOT NULL COMMENT 'Génératrice ou TSW',
    `output` BIGINT NOT NULL,
    `TDL_id` BIGINT NOT NULL,
    `TSF_id` BIGINT NOT NULL
);
CREATE TABLE `HVAC`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `type` VARCHAR(255) NOT NULL COMMENT 'RTU ou chiller ...',
    `tonnage` INT(255) NOT NULL,
    `TDL_id` BIGINT NOT NULL,
    `TSF_id` BIGINT NOT NULL
);
CREATE TABLE `AUTRE`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `type` VARCHAR(255) NOT NULL COMMENT 'Entrée Électrique HQ et Urgence, RPP',
    `output` BIGINT NOT NULL,
    `TDL_id` BIGINT NOT NULL,
    `TSF_id` BIGINT NOT NULL
);
CREATE TABLE `Besoin`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `type` VARCHAR(255) NOT NULL COMMENT 'OND or UPS',
    `TDL_id` BIGINT NOT NULL,
    `TSF_id` BIGINT NOT NULL,
    `besoin_ac` BIGINT NOT NULL,
    `besoin_dc` BIGINT NOT NULL,
    `besoin_gen` BIGINT NOT NULL,
    `besoin_clim` BIGINT NOT NULL,
    `année_req` BIGINT NOT NULL,
    `date_demande` BIGINT NOT NULL,
    `commentaire` BIGINT NOT NULL,
    `RU` BIGINT NOT NULL
);
CREATE TABLE `Fournisseurs`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `num` BIGINT NOT NULL,
    `nom` VARCHAR(255) NOT NULL,
    `Contact` VARCHAR(255) NOT NULL,
    `courriel` VARCHAR(255) NOT NULL
);
CREATE TABLE `Fabricant`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `num` BIGINT NOT NULL,
    `nom` VARCHAR(255) NOT NULL,
    `Contact` VARCHAR(255) NOT NULL,
    `courriel` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `DC` ADD CONSTRAINT `dc_tsf_id_foreign` FOREIGN KEY(`TSF_id`) REFERENCES `TSF`(`id`);
ALTER TABLE
    `AUTRE` ADD CONSTRAINT `autre_tsf_id_foreign` FOREIGN KEY(`TSF_id`) REFERENCES `TSF`(`id`);
ALTER TABLE
    `TSF` ADD CONSTRAINT `tsf_salle_id_foreign` FOREIGN KEY(`salle_id`) REFERENCES `TDL`(`id`);
ALTER TABLE
    `AC` ADD CONSTRAINT `ac_tsf_id_foreign` FOREIGN KEY(`TSF_id`) REFERENCES `TSF`(`id`);
ALTER TABLE
    `Besoin` ADD CONSTRAINT `besoin_tsf_id_foreign` FOREIGN KEY(`TSF_id`) REFERENCES `TSF`(`id`);
ALTER TABLE
    `Besoin` ADD CONSTRAINT `besoin_tdl_id_foreign` FOREIGN KEY(`TDL_id`) REFERENCES `TDL`(`id`);
ALTER TABLE
    `DC` ADD CONSTRAINT `dc_tdl_id_foreign` FOREIGN KEY(`TDL_id`) REFERENCES `TDL`(`id`);
ALTER TABLE
    `GEN_TSW` ADD CONSTRAINT `gen_tsw_tsf_id_foreign` FOREIGN KEY(`TSF_id`) REFERENCES `TSF`(`id`);
ALTER TABLE
    `AUTRE` ADD CONSTRAINT `autre_tdl_id_foreign` FOREIGN KEY(`TDL_id`) REFERENCES `TDL`(`id`);
ALTER TABLE
    `AC` ADD CONSTRAINT `ac_fournisseur_id_foreign` FOREIGN KEY(`fournisseur_id`) REFERENCES `Fournisseurs`(`id`);
ALTER TABLE
    `GEN_TSW` ADD CONSTRAINT `gen_tsw_tdl_id_foreign` FOREIGN KEY(`TDL_id`) REFERENCES `TDL`(`id`);
ALTER TABLE
    `AC` ADD CONSTRAINT `ac_tdl_id_foreign` FOREIGN KEY(`TDL_id`) REFERENCES `TDL`(`id`);
ALTER TABLE
    `AC` ADD CONSTRAINT `ac_fabricant_id_foreign` FOREIGN KEY(`fabricant_id`) REFERENCES `Fabricant`(`id`);
ALTER TABLE
    `HVAC` ADD CONSTRAINT `hvac_tdl_id_foreign` FOREIGN KEY(`TDL_id`) REFERENCES `TDL`(`id`);
ALTER TABLE
    `HVAC` ADD CONSTRAINT `hvac_tsf_id_foreign` FOREIGN KEY(`TSF_id`) REFERENCES `TSF`(`id`);