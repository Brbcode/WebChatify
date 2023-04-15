<?php

namespace App\DTO\User;

use App\Entity\User;

class UserMinDTO
{
    public static function build(User $user): array
    {
        $response = [];
        $response['email'] = $user->getEmail();
        $response['displayName'] = $user->getDisplayName();
        $response['roles'] = $user->getRoles();

        return $response;
    }
}
