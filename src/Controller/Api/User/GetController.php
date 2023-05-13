<?php

namespace App\Controller\Api\User;

use App\DTO\User\UserDTO;
use App\DTO\User\UserMinDTO;
use App\Entity\User;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class GetController extends AbstractController
{
    #[Route(
        '/users',
        name: 'api_users_get',
        methods: ['GET']
    )]
    public function index(
        Security $security,
        UserService $service
    ): JsonResponse {

        $sender = $security->getUser();
        $allUsers = $service->getAll($sender);

        return $this->json(
            [
                UserDTO::build($sender),
                ...array_map(
                    static fn(User $user)=>UserMinDTO::build($user),
                    $allUsers
                )
            ]
        );
    }
}
