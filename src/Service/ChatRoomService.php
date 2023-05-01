<?php

namespace App\Service;

use App\DomainException\Exception;
use App\DomainException\PermissionDeniedException;
use App\Entity\ChatRoom;
use App\Entity\Participant;
use App\Entity\User;
use App\Repository\ChatRoomRepository;
use App\Repository\ParticipantRepository;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Uid\Uuid;

class ChatRoomService
{
    private ChatRoomRepository $chatRoomRepository;
    private UserRepository $userRepository;
    private ParticipantRepository $participantRepository;
    private Security $security;

    public function __construct(
        ChatRoomRepository $chatRoomRepository,
        ParticipantRepository $participantRepository,
        UserRepository $userRepository,
        Security $security
    ) {
        $this->chatRoomRepository = $chatRoomRepository;
        $this->userRepository = $userRepository;
        $this->participantRepository = $participantRepository;
        $this->security = $security;
    }

    public function createChatRoom(User $owner, string $title): ChatRoom
    {
        $chatRoom = new ChatRoom($owner, $title);
        $owner->addChatRoom($chatRoom);

        $this->chatRoomRepository->save($chatRoom, true);

        return $chatRoom;
    }

    public function joinChatRoom(
        User|Ulid|string $user,
        ChatRoom|Uuid|string $chatroom
    ): ChatRoom {
        $sender = $this->security->getUser();
        $user = $this->userRepository->getUser($user);
        $chatroom = $this->chatRoomRepository->getChatRoom($chatroom);

        if ($user === null || $chatroom === null) {
            throw Exception::build("User or Chatroom not found", Response::HTTP_BAD_REQUEST);
        }

        if ($sender !== $chatroom->getOwner()) {
            throw PermissionDeniedException::build();
        }

        $participant = $this->participantRepository->findOneBy(['user' => $user, 'chatroom' => $chatroom]);

        if ($participant !== null) {
            throw Exception::build("User is already joined to this chat", Response::HTTP_BAD_REQUEST);
        }

        $participant = new Participant($user, $chatroom);
        $chatroom->addParticipant($participant);

        $this->participantRepository->save($participant, true);
        $this->chatRoomRepository->save($chatroom, true);

        return $chatroom;
    }
}
