<?php

namespace App\DTO\User;

use App\Entity\User;

class UserMinDTO
{
    public static function build(User $user): array
    {
        $response = [];
        $response['id'] = $user->getId()->jsonSerialize();
        $response['displayName'] = $user->getDisplayName();
        $response['avatar'] = $user->getAvatar();

        return $response;
    }
}
