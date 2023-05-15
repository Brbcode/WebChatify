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

class EditController extends AbstractController
{
    #[Route(
        '/message/{messageId}',
        name: 'api_message_edit',
        requirements: ['messageId' => '.*'],
        defaults: ['messageId' => ''],
        methods: ['PATCH']
    )]
    public function index(
        MessageService $service,
        string $messageId,
        Request $request
    ): JsonResponse {
        $content = json_decode($request->getContent())->content ?? '';

        return $this->json(
            MessageDTO::build($service->editMessage($messageId, $content))
        );
    }
}
