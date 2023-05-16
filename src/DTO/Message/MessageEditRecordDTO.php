<?php

namespace App\DTO\Message;

use App\DTO\User\UserMinDTO;
use App\Entity\MessageEditRecord;

class MessageEditRecordDTO
{
    public static function build(MessageEditRecord $record): array
    {
        $result = [];
        $result['editAt'] = $record->getEditAt();
        $result['editor'] = UserMinDTO::build($record->getEditor());
        $result['from'] = $record->getOriginalContent();
        $result['to'] = $record->getEditedContent();

        return $result;
    }
}
