<?php

namespace App\DTO\User;

use App\Entity\User;

class UserDTO
{
    public static function build(User $user): array
    {
        $response = [];
        $response['id'] = $user->getId()->jsonSerialize();
        $response['email'] = $user->getEmail();
        $response['displayName'] = $user->getDisplayName();
        $response['roles'] = $user->getRoles();

        return $response;
    }
}
