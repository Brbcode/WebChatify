<?php

namespace App\Controller\Api\Message;

use App\DomainException\Exception;
use App\DomainException\PermissionDeniedException;
use App\DTO\ChatRoom\ChatRoomMinDTO;
use App\DTO\Message\MessageDTO;
use App\Entity\Message;
use App\Entity\User;
use App\Service\ChatRoomService;
use App\Service\MessageService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class GetController extends AbstractController
{
    #[Route(
        '/messages/chat/{chatroomId}',
        name: 'api_message_get',
        requirements: ['chatroomId' => '.*'],
        defaults: ['chatroomId' => ''],
        methods: ['GET']
    )]
    public function index(
        MessageService $service,
        string $chatroomId,
        Security $security
    ): JsonResponse {
        $sender = $security->getUser();

        $allMessages = $service->getAllMessages($sender, $chatroomId);

        return $this->json(
            $allMessages->map(
                static fn(Message $message) => MessageDTO::build($message)
            )->toArray()
        );
    }
}
