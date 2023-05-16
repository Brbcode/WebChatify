<?php

namespace App\Controller\Api\Message;

use App\DTO\Message\MessageEditRecordDTO;
use App\Entity\MessageEditRecord;
use App\Service\MessageService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class GetRecordsController extends AbstractController
{
    #[Route(
        '/message/records/{messageId}',
        name: 'api_message_records_get',
        requirements: ['messageId' => '.*'],
        defaults: ['messageId' => ''],
        methods: ['GET'],
        priority: EditController::PRIORITY+1
    )]
    public function index(
        MessageService $service,
        string $messageId,
    ): JsonResponse {
        $records = $service->getMessageRecords($messageId);

        return $this->json(
            $records->map(
                static fn(MessageEditRecord $record) => MessageEditRecordDTO::build($record)
            )->toArray()
        );
    }
}
