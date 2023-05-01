<?php

namespace App\DTO\ChatRoom;

use App\DTO\Participant\ParticipantMinDTO;
use App\DTO\User\UserMinDTO;
use App\Entity\ChatRoom;
use App\Entity\Participant;

class ChatRoomMinDTO
{
    public static function build(ChatRoom $chatRoom): array
    {
        $response = [];
        $response['id'] = $chatRoom->getId()->jsonSerialize();
        $response['owner'] =  UserMinDTO::build($chatRoom->getOwner());
        $response['title'] = $chatRoom->getTitle();
        $response['createdAt'] = $chatRoom->getCreatedAt();
        $response['participants'] = array_map(
            static fn(Participant $p)=>ParticipantMinDTO::build($p),
            $chatRoom->getParticipants()->toArray()
        );

        return $response;
    }
}
