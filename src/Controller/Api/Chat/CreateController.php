<?php

namespace App\Controller\Api\Chat;

use App\DomainException\PermissionDeniedException;
use App\DTO\ChatRoom\ChatRoomMinDTO;
use App\Entity\User;
use App\Service\ChatRoomService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class CreateController extends AbstractController
{
    #[Route(
        '/chat/{title}',
        name: 'api_chat_create',
        requirements: ['title' => '.*'],
        defaults: ['title' => ''],
        methods: ['POST']
    )]
    public function index(
        ChatRoomService $service,
        string $title,
        Security $security
    ): JsonResponse {
        if (!(($user = $security->getUser()) instanceof User)) {
            throw PermissionDeniedException::build();
        }

        $chatRoom = $service->createChatRoom($user, $title);

        return $this->json(ChatRoomMinDTO::build($chatRoom));
    }
}
