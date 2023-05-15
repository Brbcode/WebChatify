<?php

namespace App\Types;

class DateTimeImmutableKey extends \DateTimeImmutable
{
    public static function fromDateTimeImmutable(\DateTimeInterface $dateTime): static
    {
        return new static($dateTime->format('c'));
    }

    public function __toString(): string
    {
        return $this->format('c');
    }
}
