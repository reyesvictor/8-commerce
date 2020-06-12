<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200612123023 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE region (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE shipping_method (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE shipping_pricing (id INT AUTO_INCREMENT NOT NULL, shipping_method_id INT NOT NULL, region_id INT NOT NULL, price_per_kilo DOUBLE PRECISION NOT NULL, duration INT NOT NULL, base_price DOUBLE PRECISION NOT NULL, INDEX IDX_3B9AAF75F7D6850 (shipping_method_id), INDEX IDX_3B9AAF798260155 (region_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE shipping_pricing ADD CONSTRAINT FK_3B9AAF75F7D6850 FOREIGN KEY (shipping_method_id) REFERENCES shipping_method (id)');
        $this->addSql('ALTER TABLE shipping_pricing ADD CONSTRAINT FK_3B9AAF798260155 FOREIGN KEY (region_id) REFERENCES region (id)');
        $this->addSql('ALTER TABLE commande CHANGE packaging packaging TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE product ADD supplier_id INT NOT NULL, CHANGE promo promo INT DEFAULT NULL, CHANGE clicks clicks INT DEFAULT NULL, CHANGE sex sex VARCHAR(255) DEFAULT NULL, CHANGE status status TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD2ADD6D8C FOREIGN KEY (supplier_id) REFERENCES supplier (id)');
        $this->addSql('CREATE INDEX IDX_D34A04AD2ADD6D8C ON product (supplier_id)');
        $this->addSql('ALTER TABLE sub_category CHANGE category_id category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE subproduct CHANGE promo promo INT DEFAULT NULL, CHANGE stock stock INT DEFAULT NULL');
        $this->addSql('ALTER TABLE supplier_order CHANGE status status TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE user CHANGE firstname firstname VARCHAR(180) DEFAULT NULL, CHANGE lastname lastname VARCHAR(180) DEFAULT NULL, CHANGE roles roles JSON NOT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE shipping_pricing DROP FOREIGN KEY FK_3B9AAF798260155');
        $this->addSql('ALTER TABLE shipping_pricing DROP FOREIGN KEY FK_3B9AAF75F7D6850');
        $this->addSql('DROP TABLE region');
        $this->addSql('DROP TABLE shipping_method');
        $this->addSql('DROP TABLE shipping_pricing');
        $this->addSql('ALTER TABLE commande CHANGE packaging packaging TINYINT(1) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04AD2ADD6D8C');
        $this->addSql('DROP INDEX IDX_D34A04AD2ADD6D8C ON product');
        $this->addSql('ALTER TABLE product DROP supplier_id, CHANGE promo promo INT DEFAULT NULL, CHANGE clicks clicks INT DEFAULT NULL, CHANGE sex sex VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE status status TINYINT(1) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE sub_category CHANGE category_id category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE subproduct CHANGE promo promo INT DEFAULT NULL, CHANGE stock stock INT DEFAULT NULL');
        $this->addSql('ALTER TABLE supplier_order CHANGE status status TINYINT(1) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE user CHANGE firstname firstname VARCHAR(180) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE lastname lastname VARCHAR(180) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE roles roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
    }
}
