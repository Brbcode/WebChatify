<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ReactController extends AbstractController
{
    #[Route(
        ['/','/{route}',],
        name: 'app_react',
        requirements: ['route'=>'.+'],
        defaults: ['route'=>null],
        priority: -2
    )]
    public function index(): Response
    {
        return $this->render('base.html.twig', [
            'controller_name' => 'ReactController',
        ]);
    }
}
