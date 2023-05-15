<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230515065009 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE message_edit_record (edit_at DATETIME NOT NULL COMMENT \'(DC2Type:date_immutable_key)\', editor_id BINARY(16) NOT NULL COMMENT \'(DC2Type:ulid)\', message_id BINARY(16) NOT NULL COMMENT \'(DC2Type:uuid)\', original_content LONGTEXT NOT NULL, edited_content LONGTEXT NOT NULL, INDEX IDX_D5C67E9C6995AC4C (editor_id), INDEX IDX_D5C67E9C537A1329 (message_id), PRIMARY KEY(editor_id, message_id, edit_at)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE message_edit_record ADD CONSTRAINT FK_D5C67E9C6995AC4C FOREIGN KEY (editor_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE message_edit_record ADD CONSTRAINT FK_D5C67E9C537A1329 FOREIGN KEY (message_id) REFERENCES message (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE message_edit_record DROP FOREIGN KEY FK_D5C67E9C6995AC4C');
        $this->addSql('ALTER TABLE message_edit_record DROP FOREIGN KEY FK_D5C67E9C537A1329');
        $this->addSql('DROP TABLE message_edit_record');
    }
}
