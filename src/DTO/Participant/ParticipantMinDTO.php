<?php

namespace App\DTO\Participant;

use App\DTO\User\UserMinDTO;
use App\Entity\Participant;

class ParticipantMinDTO
{
    public static function build(Participant $participant): array
    {
        $result = [...UserMinDTO::build($participant->getUser())];
        $result['joinAt'] = $participant->getJoinedAt();

        return $result;
    }
}
