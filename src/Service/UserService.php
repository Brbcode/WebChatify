<?php

namespace App\Service;

use App\DomainException\User\EmailAlreadyRegistered;
use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserService
{
    protected UserRepository $userRepository;
    protected UserPasswordHasherInterface $encoder;

    /**
     * @param UserRepository $userRepository
     * @param UserPasswordHasherInterface $encoder
     */
    public function __construct(UserRepository $userRepository, UserPasswordHasherInterface $encoder)
    {
        $this->userRepository = $userRepository;
        $this->encoder = $encoder;
    }
}
