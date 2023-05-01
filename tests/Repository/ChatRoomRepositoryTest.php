<?php

namespace Repository;

use App\Entity\ChatRoom;
use App\Entity\User;
use App\Repository\ChatRoomRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Uid\Uuid;

class ChatRoomRepositoryTest extends KernelTestCase
{
    private ChatRoomRepository $chatRoomRepository;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->chatRoomRepository = static::getContainer()->get(ChatRoomRepository::class);

        $userRepository = static::getContainer()->get(UserRepository::class);

        $testUser = $userRepository->findOneBy(['email' => 'testOwner@domain.com']);
        if ($testUser !== null) {
            $userRepository->remove($testUser, true);
        }

        $testChatRoom = $this->chatRoomRepository->find('a6a83b14-ed73-4b36-a8ee-6fede03c4f4f');
        if ($testChatRoom !== null) {
            $this->chatRoomRepository->remove($testChatRoom);
        }
    }


    public function testGetChatWithPersistChat(): void
    {
        // Test data
        $owner = new User(
            'testOwner@domain.com',
            'Test Owner User',
            'fakePassword',
            [],
            Ulid::fromString('01GZBTP69W8AQGC7C5KD9QQKGP')
        );

        $chatroom = new ChatRoom(
            $owner,
            'Test Chat Room',
            'a6a83b14-ed73-4b36-a8ee-6fede03c4f4f'
        );

        $entityManager = static::getContainer()->get('doctrine')->getManager();
        $entityManager->persist($owner);
        $entityManager->persist($chatroom);
        $entityManager->flush();

        self::assertEquals($chatroom, $this->chatRoomRepository->getChatRoom($chatroom));

        // Close
        $entityManager->remove($owner);
        $entityManager->remove($chatroom);
        $entityManager->flush();
        $entityManager->close();
    }

    public function testGetChatWithNotPersistChat(): void
    {
        // Test data
        $owner = new User(
            'testOwner@domain.com',
            'Test Owner User',
            'fakePassword',
            [],
            Ulid::fromString('01GZBTP69W8AQGC7C5KD9QQKGP')
        );

        $chatroom = new ChatRoom(
            $owner,
            'Test Chat Room',
            'a6a83b14-ed73-4b36-a8ee-6fede03c4f4f'
        );

        self::assertNull($this->chatRoomRepository->getChatRoom($chatroom));
    }

    public function testGetChatWithUuid(): void
    {
        // Test data
        $owner = new User(
            'testOwner@domain.com',
            'Test Owner User',
            'fakePassword',
            [],
            Ulid::fromString('01GZBTP69W8AQGC7C5KD9QQKGP')
        );

        $chatroom = new ChatRoom(
            $owner,
            'Test Chat Room',
            'a6a83b14-ed73-4b36-a8ee-6fede03c4f4f'
        );

        $entityManager = static::getContainer()->get('doctrine')->getManager();
        $entityManager->persist($owner);
        $entityManager->persist($chatroom);
        $entityManager->flush();

        self::assertEquals(
            $chatroom,
            $this->chatRoomRepository->getChatRoom(
                Uuid::fromString('a6a83b14-ed73-4b36-a8ee-6fede03c4f4f')
            )
        );

        // Close
        $entityManager->remove($owner);
        $entityManager->remove($chatroom);
        $entityManager->flush();
        $entityManager->close();
    }

    public function testGetUserWithUuidString(): void
    {
        // Test data
        $owner = new User(
            'testOwner@domain.com',
            'Test Owner User',
            'fakePassword',
            [],
            Ulid::fromString('01GZBTP69W8AQGC7C5KD9QQKGP')
        );

        $chatroom = new ChatRoom(
            $owner,
            'Test Chat Room',
            'a6a83b14-ed73-4b36-a8ee-6fede03c4f4f'
        );

        $entityManager = static::getContainer()->get('doctrine')->getManager();
        $entityManager->persist($owner);
        $entityManager->persist($chatroom);
        $entityManager->flush();

        self::assertEquals(
            $chatroom,
            $this->chatRoomRepository->getChatRoom(
                'a6a83b14-ed73-4b36-a8ee-6fede03c4f4f'
            )
        );

        // Close
        $entityManager->remove($owner);
        $entityManager->remove($chatroom);
        $entityManager->flush();
        $entityManager->close();
    }
}
