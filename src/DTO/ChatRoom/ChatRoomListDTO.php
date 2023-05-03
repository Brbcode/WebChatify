<?php

namespace App\DTO\ChatRoom;

use App\DTO\User\UserMinDTO;
use App\Entity\ChatRoom;
use App\Entity\User;

class ChatRoomListDTO
{
    public static function buildFromUser(User $user): array
    {
        $result = [];
        $result['owner'] = UserMinDTO::build($user);
        $result['chatrooms'] = array_map(
            static function (ChatRoom $c) {
                $rc = [];
                $rc['id'] = $c->getId()->jsonSerialize();
                $rc['title'] = $c->getTitle();
                $rc['createdAt'] = $c->getCreatedAt();
                $rc['participantsCount'] = $c->getParticipants()->count();

                return $rc;
            },
            $user->getChatRooms()->toArray()
        );

        return $result;
    }
}
