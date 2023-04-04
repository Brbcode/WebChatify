<?php

namespace App\DomainException;

use Throwable;

class Exception extends \Exception implements IDomainException
{

    public static function build(string $message, int $code, ?Throwable $previous = null): static
    {
        return new static($message, $code, $previous);
    }
}
