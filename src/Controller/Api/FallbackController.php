<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FallbackController extends AbstractController
{
    const ROUTE = 'api_fallback';

    #[Route(
        '/{fallback}',
        name: self::ROUTE,
        requirements: ['fallback'=>'.+'],
        defaults: ['fallback'=>null],
        priority: -1
    )]
    public function index(): JsonResponse
    {
        return self::getNotFoundResponse();
    }

    public static function getNotFoundResponse(): JsonResponse
    {
        $code = Response::HTTP_NOT_FOUND;
        return new JsonResponse([
            'code' => $code,
            'message' => "Invalid api endpoint"
        ], $code);
    }
}
