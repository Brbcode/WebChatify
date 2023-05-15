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

class GetOneController extends AbstractController
{
    #[Route(
        '/message/{messageId}',
        name: 'api_one_message_get',
        requirements: ['messageId' => '.*'],
        defaults: ['messageId' => ''],
        methods: ['GET']
    )]
    public function index(
        MessageService $service,
        string $messageId,
    ): JsonResponse {
        return $this->json(
            MessageDTO::build($service->getMessage($messageId))
        );
    }
}
