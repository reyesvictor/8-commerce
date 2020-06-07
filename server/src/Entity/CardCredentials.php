<?php

namespace App\Entity;

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
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $card_numbers;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $expiration_date;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="cardCredentials")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCardNumbers(): ?int
    {
        return $this->card_numbers;
    }

    public function setCardNumbers(int $card_numbers): self
    {
        $this->card_numbers = $card_numbers;

        return $this;
    }

    public function getExpirationDate(): ?string
    {
        return $this->expiration_date;
    }

    public function setExpirationDate(string $expiration_date): self
    {
        $this->expiration_date = $expiration_date;

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
}
