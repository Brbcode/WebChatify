<?php

namespace App\DomainException;

use Symfony\Component\HttpFoundation\Response;
use Throwable;

class PermissionDeniedException extends \Exception implements IDomainException
{

    public static function build(
        string $message = "Permission denied",
        int $code = Response::HTTP_UNAUTHORIZED,
        ?Throwable $previous = null
    ): static {
        return new static($message, $code, $previous);
    }
}
