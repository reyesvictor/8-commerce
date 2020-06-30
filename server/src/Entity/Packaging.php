<?php

namespace App\Entity;

use App\Repository\PackagingRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=PackagingRepository::class)
 */
class Packaging
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"user_order_details", "user_orders"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user_order_details", "user_orders"})
     */
    private $name;

    /**
     * @ORM\Column(type="date")
     * @Groups({"user_order_details", "user_orders"})
     */
    private $startsAt;

    /**
     * @ORM\Column(type="date")
     * @Groups({"user_order_details", "user_orders"})
     */
    private $endsAt;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user_orders"})
     */
    private $minSpending;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user_orders"})
     */
    private $price;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getStartsAt(): ?\DateTimeInterface
    {
        return $this->startsAt;
    }

    public function setStartsAt(\DateTimeInterface $startsAt): self
    {
        $this->startsAt = $startsAt;

        return $this;
    }

    public function getEndsAt(): ?\DateTimeInterface
    {
        return $this->endsAt;
    }

    public function setEndsAt(\DateTimeInterface $endsAt): self
    {
        $this->endsAt = $endsAt;

        return $this;
    }

    public function getMinSpending(): ?int
    {
        return $this->minSpending;
    }

    public function setMinSpending(?int $minSpending): self
    {
        $this->minSpending = $minSpending;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): self
    {
        $this->price = $price;

        return $this;
    }
}
