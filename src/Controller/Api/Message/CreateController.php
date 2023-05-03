<?php

namespace App\Controller\Api\Message;

use App\DomainException\Exception;
use App\DomainException\PermissionDeniedException;
use App\DTO\ChatRoom\ChatRoomMinDTO;
use App\DTO\Message\MessageDTO;
use App\Entity\User;
use App\Service\ChatRoomService;
use App\Service\MessageService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class CreateController extends AbstractController
{
    #[Route(
        '/message',
        name: 'api_message_create',
        methods: ['POST']
    )]
    public function index(
        MessageService $service,
        Request $request,
        Security $security
    ): JsonResponse {
        $sender = $security->getUser();
        if (null === $sender) {
            throw PermissionDeniedException::build();
        }

        $body = json_decode($request->getContent());

        if (!isset($body->chatroom) ||
            !isset($body->content)) {
            throw Exception::build("Bad Request", Response::HTTP_BAD_REQUEST);
        }

        $message = $service->registerMessage($sender, $body->chatroom, $body->content);

        return $this->json(MessageDTO::build($message));
    }
}
