<?php

namespace App\Service;

use App\DomainException\Exception;
use App\DomainException\InvalidArgumentException;
use App\DomainException\PermissionDeniedException;
use App\DTO\Message\MessageDTO;
use App\Entity\ChatRoom;
use App\Entity\Message;
use App\Entity\MessageEditRecord;
use App\Entity\Participant;
use App\Entity\User;
use App\Repository\ChatRoomRepository;
use App\Repository\MessageEditRecordRepository;
use App\Repository\MessageRepository;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Uid\Ulid;
use Symfony\Component\Uid\Uuid;

class MessageService
{
    private UserRepository $userRepository;
    private ChatRoomRepository $chatRoomRepository;
    private MessageRepository $messageRepository;
    private Security $security;
    private MessageEditRecordRepository $messageEditRecordRepository;
    private HubInterface $hub;

    /**
     * @param UserRepository $userRepository
     * @param ChatRoomRepository $chatRoomRepository
     */
    public function __construct(
        UserRepository              $userRepository,
        ChatRoomRepository          $chatRoomRepository,
        MessageRepository           $messageRepository,
        MessageEditRecordRepository $messageEditRecordRepository,
        Security                    $security,
        HubInterface $hub,
    ) {
        $this->userRepository = $userRepository;
        $this->chatRoomRepository = $chatRoomRepository;
        $this->messageRepository = $messageRepository;
        $this->security = $security;
        $this->messageEditRecordRepository = $messageEditRecordRepository;
        $this->hub = $hub;
    }

    public function registerMessage(
        User|Ulid|string $sender,
        ChatRoom|Uuid|string $chatroom,
        string $content
    ): Message {
        $sender = $this->userRepository->getUser($sender);
        $chatroom = $this->chatRoomRepository->getChatRoom($chatroom);

        if ($sender === null) {
            throw PermissionDeniedException::build();
        }

        if ($chatroom === null) {
            throw Exception::build("Chatroom not found", Response::HTTP_BAD_REQUEST);
        }

        if (!$chatroom->getParticipants()
            ->exists(static fn($k, Participant $p)=>$p->getUser()===$sender)
        ) {
            throw PermissionDeniedException::build();
        }

        $message = new Message($sender, $chatroom, $content);

        $this->messageRepository->save($message, true);

        $messages = $this->getAllMessages($sender, $chatroom);
        $messages = array_map(
            static fn(Message $m)=>MessageDTO::build($m),
            $messages
        );

        $this->hub->publish(new Update(
            sprintf('sse:chat:%s', $chatroom->getId()->jsonSerialize()),
            json_encode($messages)
        ));

        return $message;
    }

    /**
     * @return Message[]
     */
    public function getAllMessages(
        User|Ulid|string|null     $user,
        ChatRoom|Uuid|string|null $chatroom,
    ): array {
        $user = $this->userRepository->getUser($user);
        $chatroom = $this->chatRoomRepository->getChatRoom($chatroom);

        if (null === $chatroom) {
            throw Exception::build("Chatroom not found", Response::HTTP_BAD_REQUEST);
        }

        if ($user === null ||
            !$chatroom->getParticipants()
                ->exists(static fn($k, Participant $p)=>$p->getUser()===$user)
        ) {
            throw PermissionDeniedException::build();
        }

        $messagesArray = $chatroom->getMessages()
            ->filter(static fn(Message $m)=>$m->isVisible())
            ->toArray()
        ;

        usort(
            $messagesArray,
            static fn(Message $a, Message $b) => $a->getCreatedAt() > $b->getCreatedAt() ? 1 : -1
        );

        return $messagesArray;
    }

    public function getMessage(Message|Uuid|string|null $message): Message
    {
        $sender = $this->security->getUser();
        $message = $this->messageRepository->getMessage($message);

        if (null === $message) {
            throw InvalidArgumentException::build('Message not found');
        }

        if (null === $sender || !$message->getChatroom()->getParticipants()->exists(
            static fn($k, Participant $p)=>$p->getUser()===$sender
        )) {
            throw PermissionDeniedException::build();
        }

        return $message;
    }

    public function editMessage(Message|Uuid|string|null $message, string $content): Message
    {
        $sender = $this->security->getUser();
        $message = $this->messageRepository->getMessage($message);

        if (null === $message) {
            throw InvalidArgumentException::build('Message not found');
        }

        if (empty($content)) {
            throw InvalidArgumentException::build('Empty content are not allowed');
        }

        if (null === $sender || $message->getSender() !== $sender) {
            throw PermissionDeniedException::build();
        }

        $editRecord = new MessageEditRecord($sender, $message, $message->getContent(), $content);
        $message->addEditRecord($editRecord);

        $this->messageEditRecordRepository->save($editRecord);
        $this->messageRepository->save($message, true);

        return $message;
    }

    /**
     * @return Collection<int, MessageEditRecord>
     */
    public function getMessageRecords(Message|Uuid|string|null $message): Collection
    {
        $sender = $this->security->getUser();

        $message = $this->messageRepository->getMessage($message);

        if (null === $message) {
            throw InvalidArgumentException::build('Message not found');
        }

        if (null === $sender || !in_array('ROLE_ADMIN', $sender->getRoles())) {
            throw PermissionDeniedException::build();
        }

        return $message->getEditRecords();
    }
}
