<?php

namespace App\Entity;

use App\Repository\ParticipantRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ParticipantRepository::class)]
class Participant
{
    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private User $user;

    #[ORM\Id]
    #[ORM\ManyToOne(inversedBy: 'participants')]
    #[ORM\JoinColumn(nullable: false)]
    private ChatRoom $chatroom;

    #[ORM\Column]
    private \DateTimeImmutable $joinedAt;

    /**
     * @param User $user
     * @param ChatRoom $chatroom
     * @param \DateTimeImmutable|null $joinedAt
     */
    public function __construct(User $user, ChatRoom $chatroom, ?\DateTimeImmutable $joinedAt = null)
    {
        $this->user = $user;
        $this->chatroom = $chatroom;
        $this->joinedAt = $joinedAt ?? new \DateTimeImmutable();
    }


    public function getJoinedAt(): \DateTimeImmutable
    {
        return $this->joinedAt;
    }

    public function setJoinedAt(\DateTimeImmutable $joinedAt): self
    {
        $this->joinedAt = $joinedAt;

        return $this;
    }

    public function getUser(): User
    {
        return $this->user;
    }


    public function getChatroom(): ChatRoom
    {
        return $this->chatroom;
    }
}
