<?php

namespace App\Controller\Api\Chat;

use App\DomainException\PermissionDeniedException;
use App\DTO\ChatRoom\ChatRoomListDTO;
use App\DTO\ChatRoom\ChatRoomMinDTO;
use App\Entity\ChatRoom;
use App\Service\ChatRoomService;
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
        Security $security,
        ChatRoomService $service
    ): JsonResponse {
        $chatrooms = $service->getAllChatrooms($security->getUser());

        return $this->json(
            array_map(
                static fn(ChatRoom $c)=>ChatRoomMinDTO::build($c),
                $chatrooms
            )
        );
    }
}
