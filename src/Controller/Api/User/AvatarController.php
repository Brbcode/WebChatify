<?php

namespace App\Controller\Api\User;

use App\DTO\User\UserDTO;
use App\DTO\User\UserMinDTO;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Uid\Ulid;

class AvatarController extends AbstractController
{
    #[Route(
        '/user/avatar',
        name: 'api_avatar',
        methods: ['POST']
    )]
    public function index(
        Security $security,
        Request $request,
        UserRepository $userRepository
    ): JsonResponse {
        /** @var $sender User */
        $sender = $security->getUser();

        if ($avatar = $request->files->get('avatar')) {
            $safeFilename = Ulid::generate();
            $newFilename = $safeFilename.'.'.$avatar->guessExtension();

            $avatar->move(
                $this->getParameter('IMAGE_DIR'),
                $newFilename
            );

            $sender->setAvatar($newFilename);
            $userRepository->save($sender, true);
        }

        return $this->json(UserDTO::build($sender));
    }
}
