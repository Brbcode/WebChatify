<?php

namespace App\Service;

use App\DomainException\Exception;
use App\DomainException\InvalidArgumentException;
use App\DomainException\PermissionDeniedException;
use App\Entity\ChatRoom;
use App\Entity\Message;
use App\Entity\Participant;
use App\Entity\User;
use App\Repository\ChatRoomRepository;
use App\Repository\MessageRepository;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Uid\Uuid;

class MessageService
{
    private UserRepository $userRepository;
    private ChatRoomRepository $chatRoomRepository;
    private MessageRepository $messageRepository;
    private Security $security;

    /**
     * @param UserRepository $userRepository
     * @param ChatRoomRepository $chatRoomRepository
     */
    public function __construct(
        UserRepository $userRepository,
        ChatRoomRepository $chatRoomRepository,
        MessageRepository $messageRepository,
        Security $security
    ) {
        $this->userRepository = $userRepository;
        $this->chatRoomRepository = $chatRoomRepository;
        $this->messageRepository = $messageRepository;
        $this->security = $security;
    }

    public function registerMessage(
        User|Ulid|string $sender,
        ChatRoom|Uuid|string $chatroom,
        string $content
    ): Message {
        $sender = $this->userRepository->getUser($sender);
        $chatroom = $this->chatRoomRepository->getChatRoom($chatroom);

        if ($sender === null) {
            throw PermissionDeniedException::build();
        }

        if ($chatroom === null) {
            throw Exception::build("Chatroom not found", Response::HTTP_BAD_REQUEST);
        }

        if (!$chatroom->getParticipants()
            ->exists(static fn($k, Participant $p)=>$p->getUser()===$sender)
        ) {
            throw PermissionDeniedException::build();
        }

        $message = new Message($sender, $chatroom, $content);

        $this->messageRepository->save($message, true);

        return $message;
    }

    public function getAllMessages(
        User|Ulid|string|null     $user,
        ChatRoom|Uuid|string|null $chatroom,
    ): Collection {
        $user = $this->userRepository->getUser($user);
        $chatroom = $this->chatRoomRepository->getChatRoom($chatroom);

        if (null === $chatroom) {
            throw Exception::build("Chatroom not found", Response::HTTP_BAD_REQUEST);
        }

        if ($user === null ||
            !$chatroom->getParticipants()
                ->exists(static fn($k, Participant $p)=>$p->getUser()===$user)
        ) {
            throw PermissionDeniedException::build();
        }

        return $chatroom->getMessages();
    }

    public function getMessage(Message|Uuid|string|null $message): Message
    {
        $sender = $this->security->getUser();
        $message = $this->messageRepository->getMessage($message);

        if (null === $message) {
            throw InvalidArgumentException::build('Message not found');
        }

        if (null === $sender || !$message->getChatroom()->getParticipants()->exists(
            static fn($k, Participant $p)=>$p->getUser()===$sender
        )) {
            throw PermissionDeniedException::build();
        }

        return $message;
    }
}
