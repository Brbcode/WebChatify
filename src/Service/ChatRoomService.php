<?php

namespace App\Service;

use App\Entity\ChatRoom;
use App\Entity\User;
use App\Repository\ChatRoomRepository;

class ChatRoomService
{
    private ChatRoomRepository $chatRoomRepository;

    public function __construct(ChatRoomRepository $chatRoomRepository)
    {
        $this->chatRoomRepository = $chatRoomRepository;
    }

    public function createChatRoom(User $owner, string $title): ChatRoom
    {
        $chatRoom = new ChatRoom($owner, $title);
        $owner->addChatRoom($chatRoom);

        $this->chatRoomRepository->save($chatRoom, true);

        return $chatRoom;
    }
}
