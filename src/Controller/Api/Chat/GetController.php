<?php

namespace App\Controller\Api\Chat;

use App\DomainException\PermissionDeniedException;
use App\DTO\ChatRoom\ChatRoomListDTO;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class GetController extends AbstractController
{
    #[Route(
        '/chat',
        name: 'api_chat_get',
        methods: ['GET']
    )]
    public function index(
        Security $security
    ): JsonResponse {
        if (null === ($user = $security->getUser())) {
            throw PermissionDeniedException::build();
        }

        return $this->json(ChatRoomListDTO::buildFromUser($user));
    }
}
