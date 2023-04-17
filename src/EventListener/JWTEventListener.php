<?php

namespace App\EventListener;

use App\Controller\Api\FallbackController;
use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
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
            $code = Response::HTTP_NOT_FOUND;
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

        $injectData = [
            'email' => $user->getEmail(),
            'displayName' => $user->getDisplayName(),
            'roles' => $user->getRoles()
        ];

        $data = array_merge(
            $injectData,
            $event->getData()
        );

        $event->setData($data);
    }
}
