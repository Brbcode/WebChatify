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

    public function signUp(string $email, string $displayName, string $plainPassword) : User
    {
        if ($this->userRepository->findBy(['email' => $email])) {
            throw EmailAlreadyRegistered::build();
        }

        $user = new User($email, $displayName, $plainPassword);

        $password = $this->encoder->hashPassword($user, $plainPassword);

        $user->setPassword($password);

        $this->userRepository->save($user, true);

        return $user;
    }
}
