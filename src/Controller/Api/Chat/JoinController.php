<?php

namespace App\Controller\Api\Chat;

use App\DTO\ChatRoom\ChatRoomMinDTO;
use App\Service\ChatRoomService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class JoinController extends AbstractController
{
    #[Route(
        '/join/chat',
        name: 'api_chat_join',
    )]
    public function index(
        Request $request,
        ChatRoomService $service,
    ): JsonResponse {
        $body = json_decode($request->getContent());

        if (null === $body ||
            !isset($body->user) ||
            !isset($body->chatroom)) {
            $code = Response::HTTP_BAD_REQUEST;
            return new JsonResponse([
                'code' => $code,
                'message' => "Bad Request"
            ], $code);
        }

        $chatroom = $service->joinChatRoom($body->user, $body->chatroom);

        return $this->json(ChatRoomMinDTO::build($chatroom));
    }
}
