<?php

namespace App\EventListener;

use App\Controller\Api\FallbackController;
use App\DTO\User\UserDTO;
use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationFailureEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTExpiredEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTNotFoundEvent;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class JWTEventListener
{
    public function onJWTNotFound(JWTNotFoundEvent $event): void
    {
        $request = $event->getRequest();

        $routeName = $request->attributes->get('_route');

        if ($routeName === FallbackController::ROUTE) {
            $response = FallbackController::getNotFoundResponse();
        } else {
            $code = Response::HTTP_UNAUTHORIZED;
            $response = new JsonResponse([
                'code' => $code,
                'message' => 'Permission denied'
            ], $code);
        }

        $event->setResponse($response);
    }

    public function onAuthSuccessResponse(AuthenticationSuccessEvent $event): void
    {
        $user = $event->getUser();

        if (!$user instanceof User) {
            return;
        }

        $injectData = UserDTO::build($user);

        $data = array_merge(
            $injectData,
            $event->getData()
        );

        $event->setData($data);
    }

    public function onAuthFailureResponse(AuthenticationFailureEvent $event): void
    {
        $code = Response::HTTP_UNAUTHORIZED;
        $response = new JsonResponse([
            "message" => "Email or password are wrong",
            "code" => $code
        ], $code);

        $event->setResponse($response);
    }

    public function onJWTExpired(JWTExpiredEvent $event): void
    {
        $message = 'Session has expired';
        $code = Response::HTTP_UNAUTHORIZED;
        $response = new JsonResponse([
            'message' => $message,
            'code' => $code,
        ], $code);
        $event->setResponse($response);
    }
}
