<?php

namespace App\Entity;

use App\Repository\MessageEditRecordRepository;
use App\Types\DateTimeImmutableKey;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MessageEditRecordRepository::class)]
class MessageEditRecord
{
    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private User $editor;

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'editRecords')]
    #[ORM\JoinColumn(nullable: false)]
    private Message $message;

    #[ORM\Id]
    #[ORM\Column(type: 'date_immutable_key')]
    private DateTimeImmutableKey $editAt;

    #[ORM\Column(type: Types::TEXT)]
    private string $originalContent;

    #[ORM\Column(type: Types::TEXT)]
    private string $editedContent;

    public function __construct(
        User $editor,
        Message $message,
        string $originalContent,
        string $editedContent,
        \DateTimeInterface|null $editAt = null
    ) {
        $this->editor = $editor;
        $this->message = $message;
        $this->originalContent = $originalContent;
        $this->editedContent = $editedContent;
        if ($editAt !== null) {
            $this ->editAt = DateTimeImmutableKey::fromDateTimeImmutable($editAt);
        } else {
            $this->editAt = new DateTimeImmutableKey();
        }
    }

    public function getEditAt(): DateTimeImmutableKey
    {
        return $this->editAt;
    }

    public function getOriginalContent(): string
    {
        return $this->originalContent;
    }

    public function setOriginalContent(string $originalContent): self
    {
        $this->originalContent = $originalContent;

        return $this;
    }

    public function getEditedContent(): string
    {
        return $this->editedContent;
    }

    public function setEditedContent(string $editedContent): self
    {
        $this->editedContent = $editedContent;

        return $this;
    }

    public function getMessage(): Message
    {
        return $this->message;
    }

    public function setMessage(Message $message): self
    {
        $this->message = $message;

        return $this;
    }

    public function getEditor(): User
    {
        return $this->editor;
    }

    public function setEditor(User $editor): self
    {
        $this->editor = $editor;

        return $this;
    }
}
