<?php

declare(strict_types=1);

namespace App\Tests\Behat;

use App\Repository\UserRepository;
use Behat\Behat\Tester\Exception\PendingException;
use Behatch\Context\BaseContext;

class UserContext extends BaseContext
{

    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * @Given user with email :email exist
     */
    public function userWithEmailExist(string $email)
    {
        $user = $this->userRepository->findOneBy(['email'=>$email]);

        if (null === $user) {
            throw new \Exception("User does not exist");
        }
    }

    /**
     * @Given user with email :email not exist
     */
    public function userWithEmailNotExist(string $email)
    {
        $user = $this->userRepository->findOneBy(['email'=>$email]);

        self::assertNull($user, "User exist");
    }
}
