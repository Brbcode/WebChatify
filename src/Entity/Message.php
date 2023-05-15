<?php

namespace App\Entity;

use App\Repository\MessageRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: MessageRepository::class)]
class Message
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', nullable: false)]
    private Uuid $id;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $sender = null;

    #[ORM\ManyToOne(inversedBy: 'messages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?ChatRoom $chatroom = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE, nullable: false)]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column]
    private bool $isVisible;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $editAt = null;

    #[ORM\Column(type: Types::TEXT)]
    private string $content;

    #[ORM\OneToMany(mappedBy: 'message', targetEntity: MessageEditRecord::class, orphanRemoval: true)]
    private Collection $editRecords;

    /**
     * @param User $sender
     * @param ChatRoom $chatroom
     * @param string $content
     * @param \DateTimeInterface|null $createdAt
     * @param Uuid|string|null $id
     * @param bool $isVisible
     */
    public function __construct(
        User $sender,
        ChatRoom $chatroom,
        string $content,
        \DateTimeInterface|null $createdAt = null,
        \DateTimeInterface|null $editAt = null,
        Uuid|string|null $id = null,
        bool $isVisible = true
    ) {
        $this->sender = $sender;
        $this->chatroom = $chatroom;
        $this->createdAt = $createdAt ?? new \DateTimeImmutable();
        $this->editAt = $editAt;
        $this->isVisible = $isVisible;
        $this->content = $content;

        if (is_string($id)) {
            $this->id = Uuid::fromString($id);
        } else {
            $this->id = $id ?? Uuid::v4();
        }

        $this->editRecords = new ArrayCollection();
    }

    public function getId(): Uuid
    {
        return $this->id;
    }

    public function getSender(): User
    {
        return $this->sender;
    }

    public function getChatroom(): ChatRoom
    {
        return $this->chatroom;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function isIsVisible(): bool
    {
        return $this->isVisible;
    }

    public function setIsVisible(bool $isVisible): self
    {
        $this->isVisible = $isVisible;

        return $this;
    }

    public function getEditAt(): \DateTimeInterface|null
    {
        return $this->editAt;
    }

    public function setEditAt(\DateTimeInterface $editAt): self
    {
        $this->editAt = $editAt;

        return $this;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getDate(): \DateTimeInterface
    {
        return $this->editAt ?? $this->createdAt;
    }

    public function isEdited(): bool
    {
        return null !== $this->editAt;
    }

    /**
     * @return Collection<int, MessageEditRecord>
     */
    public function getEditRecords(): Collection
    {
        return $this->editRecords;
    }

    public function addEditRecord(MessageEditRecord $editRecord): self
    {
        if (!$this->editRecords->contains($editRecord)) {
            $this->editRecords->add($editRecord);
            $editRecord->setMessage($this);
        }

        return $this;
    }
}
