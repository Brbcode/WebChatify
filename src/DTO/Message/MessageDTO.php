<?php

namespace App\DTO\Message;

use App\Entity\Message;

class MessageDTO
{
    public static function build(Message $message): array
    {
        $result = [];
        $result['id'] = $message->getId()->jsonSerialize();
        $result['createdAt'] = $message->getCreatedAt();
        if ($message->isEdited()) {
            $result['editAt'] = $message->getEditAt();
        }
        $result['sender'] = $message->getSender()->getId()->jsonSerialize();
        $result['chatroom'] = $message->getChatroom()->getId()->jsonSerialize();
        $result['content'] = $message->getContent();

        return $result;
    }
}
