<?php

namespace App\DTO\ChatRoom;

use App\DTO\User\UserMinDTO;
use App\Entity\ChatRoom;

class ChatRoomMinDTO
{
    public static function build(ChatRoom $chatRoom): array
    {
        $response = [];
        $response['id'] = $chatRoom->getId()->jsonSerialize();
        $response['owner'] =  UserMinDTO::build($chatRoom->getOwner());
        $response['title'] = $chatRoom->getTitle();
        $response['createdAt'] = $chatRoom->getCreatedAt();

        return $response;
    }
}
