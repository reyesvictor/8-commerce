<?php

namespace App\Entity;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Mapping\ClassMetadata;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Repository\CardCredentialsRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=CardCredentialsRepository::class)
 */
class CardCredentials
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"user"})
     */
    private $id;

    /**
     * @ORM\Column(type="bigint")
     * @Groups({"user"})
     */
    private $cardNumbers;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user"})
     */
    private $expirationDate;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="cardCredentials")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user"})
     */
    private $user;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user"})
     */
    private $ccv;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user"})
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user"})
     */
    private $lastname;

    public static function loadValidatorMetadata(ClassMetadata $metadata)
    {
        $metadata->addPropertyConstraint('cardNumbers', new Assert\NotBlank());
        $metadata->addPropertyConstraint('expirationDate', new Assert\NotBlank());
        $metadata->addPropertyConstraint('ccv', new Assert\NotBlank());
        $metadata->addPropertyConstraint('firstname', new Assert\NotBlank());
        $metadata->addPropertyConstraint('lastname', new Assert\NotBlank());
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCardNumbers(): ?int
    {
        return $this->cardNumbers;
    }

    public function setCardNumbers(int $cardNumbers): self
    {
        $this->cardNumbers = $cardNumbers;

        return $this;
    }

    public function getExpirationDate(): ?string
    {
        return $this->expirationDate;
    }

    public function setExpirationDate(string $expirationDate): self
    {
        $this->expirationDate = $expirationDate;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getCcv(): ?int
    {
        return $this->ccv;
    }

    public function setCcv(?int $ccv): self
    {
        $this->ccv = $ccv;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }
}
