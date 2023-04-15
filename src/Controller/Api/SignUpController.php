<?php

namespace App\Controller\Api;

use App\DTO\User\UserMinDTO;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SignUpController extends AbstractController
{
    #[Route(
        '/signup',
        name: 'api_signup',
    )]
    public function index(Request $request, UserService $service): JsonResponse
    {
        $body = json_decode($request->getContent());

        if (!isset($body->displayName) ||
            !isset($body->email) ||
            !isset($body->password)
        ) {
            $code = Response::HTTP_BAD_REQUEST;
            return $this->json([
                'code' => $code,
                'message' => 'Bad Request'
            ], $code);
        }

        $user = $service->signUp($body->email, $body->displayName, $body->password);

        return $this->json(UserMinDTO::build($user));
    }
}
