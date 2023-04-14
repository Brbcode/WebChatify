<?php

namespace App\DomainException\User;

use App\DomainException\IDomainException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class EmailAlreadyRegistered extends \InvalidArgumentException implements IDomainException
{
    public static function build(
        string $message = "Email is already registered",
        int $code = Response::HTTP_BAD_REQUEST,
        ?Throwable $previous = null
    ): static {
        return new static($message, $code, $previous);
    }
}
