<?php

namespace App\Entity;

use App\DomainException\InvalidArgumentException;
use App\Repository\ChatRoomRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: ChatRoomRepository::class)]
class ChatRoom
{
    private const TITLE_LENGTH = 128;

    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    private Uuid $id;

    #[ORM\Column(length: self::TITLE_LENGTH)]
    private string $title;

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    #[ORM\ManyToOne(inversedBy: 'chatRooms')]
    #[ORM\JoinColumn(nullable: false)]
    private User $owner;

    #[ORM\OneToMany(mappedBy: 'chatroom', targetEntity: Participant::class, orphanRemoval: true)]
    private Collection $participants;

    /**
     * @param User $owner
     * @param string $title
     * @param Uuid|string|null $id
     * @param \DateTimeImmutable|null $createdAt
     */
    public function __construct(
        User $owner,
        string $title,
        Uuid|string|null $id = null,
        ?\DateTimeImmutable $createdAt = null
    ) {
        self::assertTitle($title);

        $this->title = $title;
        $this->createdAt = $createdAt ?? new \DateTimeImmutable();
        $this->owner = $owner;

        if (is_string($id)) {
            $this->id = Uuid::fromString($id);
        } else {
            $this->id = $id ?? Uuid::v4();
        }
        $this->participants = new ArrayCollection();
    }


    public function getId(): Uuid
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        self::assertTitle($title);
        $this->title = $title;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getOwner(): User
    {
        return $this->owner;
    }

    public function setOwner(User $owner): self
    {
        $this->owner = $owner;

        return $this;
    }

    public static function assertTitle(string $title): void
    {
        $titleLength = strlen($title);
        if (!($titleLength>0 && $titleLength<self::TITLE_LENGTH)) {
            throw new InvalidArgumentException('Invalid title');
        }
    }

    /**
     * @return Collection<int, Participant>
     */
    public function getParticipants(): Collection
    {
        return $this->participants;
    }

    public function addParticipant(Participant $participant): self
    {
        if (!$this->participants->contains($participant)
            && $participant->getChatroom() === $this) {
            $this->participants->add($participant);
        }

        return $this;
    }

    public function removeParticipant(Participant $participant): self
    {
        throw new \LogicException("Not implemented yet");
    }
}
