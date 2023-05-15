<?php

namespace App\Doctrine\Types;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;
use Symfony\Component\HttpKernel\KernelInterface;

class DateTimeImmutableKey extends \Doctrine\DBAL\Types\DateTimeImmutableType
{
    public const NAME = 'date_immutable_key';

    public function convertToPHPValue($value, AbstractPlatform $platform): \App\Types\DateTimeImmutableKey|null
    {
        $value = parent::convertToPHPValue($value, $platform);
        if ($value !== null) {
            $value = \App\Types\DateTimeImmutableKey::fromDateTimeImmutable($value);
        }

        return $value;
    }

    public function getName(): string
    {
        return static::NAME;
    }
}
