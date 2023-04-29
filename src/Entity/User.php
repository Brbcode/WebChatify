<?php

namespace App\Entity;

use App\DomainException\InvalidArgumentException;
use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    private const NAME_LENGTH = 128;

    #[ORM\Column(length: 180, unique: true)]
    private string $email;

    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column(length: 60)]
    private string $password;

    #[ORM\Column(length: self::NAME_LENGTH)]
    private string $displayName;

    #[ORM\Id]
    #[ORM\Column(type: 'ulid', unique: true)]
    private Ulid $id;

    /**
     * @param string $email
     * @param string $password
     * @param array $roles
     */
    public function __construct(
        string $email,
        string $displayName,
        string $password,
        array $roles = [],
        Ulid|string|null $id = null
    ) {
        self::assertEmail($email);
        self::assertDisplayName($displayName);

        $this->email = $email;
        $this->roles = $roles;
        $this->password = $password;
        $this->displayName = $displayName;

        if (is_string($id)) {
            $this->id = Ulid::fromString($id);
        } else {
            $this->id = $id ?? new Ulid();
        }
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        self::assertEmail($email);
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getDisplayName(): string
    {
        return $this->displayName;
    }

    public function setDisplayName(string $displayName): self
    {
        self::assertDisplayName($displayName);
        $this->displayName = $displayName;

        return $this;
    }

    public function getId(): Ulid
    {
        return $this->id;
    }

    public static function assertEmail(string $email): void
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Email not valid');
        }
    }

    public static function assertDisplayName(string $name): void
    {
        $nameLength = strlen($name);
        if (!($nameLength>0 && $nameLength<self::NAME_LENGTH)) {
            throw new InvalidArgumentException('Invalid display name');
        }
    }
}
