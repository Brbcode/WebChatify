<?php

namespace App\Service;

use App\DomainException\Exception;
use App\DomainException\PermissionDeniedException;
use App\DTO\ChatRoom\ChatRoomMinDTO;
use App\Entity\ChatRoom;
use App\Entity\Participant;
use App\Entity\User;
use App\Repository\ChatRoomRepository;
use App\Repository\ParticipantRepository;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Uid\Uuid;

class ChatRoomService
{
    private ChatRoomRepository $chatRoomRepository;
    private UserRepository $userRepository;
    private ParticipantRepository $participantRepository;
    private Security $security;
    private HubInterface $hub;

    public function __construct(
        ChatRoomRepository $chatRoomRepository,
        ParticipantRepository $participantRepository,
        UserRepository $userRepository,
        Security $security,
        HubInterface $hub
    ) {
        $this->chatRoomRepository = $chatRoomRepository;
        $this->userRepository = $userRepository;
        $this->participantRepository = $participantRepository;
        $this->security = $security;
        $this->hub = $hub;
    }

    public function createChatRoom(User $owner, string $title): ChatRoom
    {
        $chatRoom = new ChatRoom($owner, $title);
        $owner->addChatRoom($chatRoom);

        $this->chatRoomRepository->save($chatRoom, true);

        return $chatRoom;
    }

    /**
     * @return ChatRoom[]
     */
    public function getAllChatrooms(User|Ulid|string|null $user): array
    {
        $sender = $this->security->getUser();
        $user = $this->userRepository->getUser($user);
        $participants = $this->participantRepository->findBy(['user' => $user]);

        if ($sender === null) {
            throw PermissionDeniedException::build();
        }

        $ownerChatrooms = $user->getChatRooms()->toArray();
        $participantsChatrooms = array_map(
            static fn(Participant $p)=>$p->getChatroom(),
            $participants
        );

        $allChatrooms = array_merge($ownerChatrooms, $participantsChatrooms);
        usort(
            $allChatrooms,
            static fn(ChatRoom $c1, ChatRoom $c2) => strcmp($c1->getTitle(), $c2->getTitle())
        );

        return $allChatrooms;
    }

    public function joinChatRoom(
        User|Ulid|string|null $user,
        ChatRoom|Uuid|string|null $chatroom
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

        if ($chatroom->getOwner()===$user) {
            throw Exception::build("Owner can't join to own chat", Response::HTTP_BAD_REQUEST);
        }

        if ($participant !== null) {
            throw Exception::build("User is already joined to this chat", Response::HTTP_BAD_REQUEST);
        }

        $participant = new Participant($user, $chatroom);
        $chatroom->addParticipant($participant);

        $this->participantRepository->save($participant, true);
        $this->chatRoomRepository->save($chatroom, true);

        $chatrooms = $this->getAllChatrooms($participant->getUser());
        $chatrooms = array_map(
            static fn(ChatRoom $c)=>ChatRoomMinDTO::build($c),
            $chatrooms
        );

        $this->hub->publish(new Update(
            sprintf('sse:chatrooms:%s', $participant->getUser()->getId()->jsonSerialize()),
            json_encode($chatrooms)
        ));

        return $chatroom;
    }
}
