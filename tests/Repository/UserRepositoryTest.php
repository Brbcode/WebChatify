<?php

namespace App\Tests\Repository;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Uid\Ulid;

class UserRepositoryTest extends KernelTestCase
{
    private UserRepository $userRepository;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->userRepository = static::getContainer()->get(UserRepository::class);

        $testUser = $this->userRepository->find('test@domain.com');
        if ($testUser !== null) {
            $this->userRepository->remove($testUser, true);
        }
    }


    public function testGetUserWithPersistUser(): void
    {
        // Test data
        $user = new User(
            'test@domain.com',
            'Test User',
            'fakePassword',
            [],
            Ulid::fromString('01F92V7SCZ9XETJW7NPZJGJHKV')
        );

        $entityManager = static::getContainer()->get('doctrine')->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        self::assertEquals($user, $this->userRepository->getUser($user));

        // Close
        $entityManager->remove($user);
        $entityManager->flush();
        $entityManager->close();
    }

    public function testGetUserWithNotPersistUser(): void
    {
        // Test data
        $user = new User(
            'test@domain.com',
            'Test User',
            'fakePassword',
            [],
            Ulid::fromString('01F92V7SCZ9XETJW7NPZJGJHKV')
        );

        self::assertNull($this->userRepository->getUser($user));
    }

    public function testGetUserWithUlid(): void
    {
        // Test data
        $user = new User(
            'test@domain.com',
            'Test User',
            'fakePassword',
            [],
            Ulid::fromString('01F92V7SCZ9XETJW7NPZJGJHKV')
        );

        $entityManager = static::getContainer()->get('doctrine')->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        self::assertEquals(
            $user,
            $this->userRepository->getUser(
                Ulid::fromString('01F92V7SCZ9XETJW7NPZJGJHKV')
            )
        );

        // Close
        $entityManager->remove($user);
        $entityManager->flush();
        $entityManager->close();
    }

    public function testGetUserWithUlidString(): void
    {
        // Test data
        $user = new User(
            'test@domain.com',
            'Test User',
            'fakePassword',
            [],
            Ulid::fromString('01F92V7SCZ9XETJW7NPZJGJHKV')
        );

        $entityManager = static::getContainer()->get('doctrine')->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        self::assertEquals(
            $user,
            $this->userRepository->getUser(
                '01F92V7SCZ9XETJW7NPZJGJHKV'
            )
        );

        // Close
        $entityManager->remove($user);
        $entityManager->flush();
        $entityManager->close();
    }

    public function testGetUserWithEmail(): void
    {
        // Test data
        $user = new User(
            'test@domain.com',
            'Test User',
            'fakePassword',
            [],
            Ulid::fromString('01F92V7SCZ9XETJW7NPZJGJHKV')
        );

        $entityManager = static::getContainer()->get('doctrine')->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        self::assertEquals(
            $user,
            $this->userRepository->getUser(
                'test@domain.com'
            )
        );

        // Close
        $entityManager->remove($user);
        $entityManager->flush();
        $entityManager->close();
    }
}
