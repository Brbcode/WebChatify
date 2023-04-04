<?php

namespace App\DomainException;

use Symfony\Component\HttpFoundation\Response;
use Throwable;

class InvalidArgumentException extends \InvalidArgumentException implements IDomainException
{


    public function __construct(
        string $message = "",
        int $code = Response::HTTP_BAD_REQUEST,
        ?Throwable $throwable = null
    ) {
        parent::__construct($message, $code, $throwable);
    }

    public static function build(
        string $message,
        int $code = Response::HTTP_BAD_REQUEST,
        ?Throwable $previous = null
    ): static {
        return new static($message, $code, $previous);
    }

    public static function buildFromArgumentName(
        string $argumentName,
        int $code = Response::HTTP_BAD_REQUEST,
        ?Throwable $previous = null
    ): static {
        return static::build(
            sprintf("Invalid Argument '%s'", $argumentName),
            $code,
            $previous
        );
    }
}
