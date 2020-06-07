<?php

namespace App\Entity;

use App\Repository\CommandeRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=CommandeRepository::class)
 */
class Commande
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Subproduct::class, inversedBy="commandes")
     * @ORM\JoinColumn(nullable=false)
     */
    private $Subproduct;

    /**
     * @ORM\ManyToOne(targetEntity=Address::class, inversedBy="commandes")
     * @ORM\JoinColumn(nullable=false)
     */
    private $address;

    /**
     * @ORM\Column(type="integer")
     */
    private $tracking_number;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $packaging;

    /**
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getSubproduct(): ?Subproduct
    {
        return $this->Subproduct;
    }

    public function setSubproduct(?Subproduct $Subproduct): self
    {
        $this->Subproduct = $Subproduct;

        return $this;
    }

    public function getAddress(): ?Address
    {
        return $this->address;
    }

    public function setAddress(?Address $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getTrackingNumber(): ?string
    {
        return $this->tracking_number;
    }

    public function setTrackingNumber(string $tracking_number): self
    {
        $this->tracking_number = $tracking_number;

        return $this;
    }

    public function getPackaging(): ?bool
    {
        return $this->packaging;
    }

    public function setPackaging(?bool $packaging): self
    {
        $this->packaging = $packaging;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeInterface $created_at): self
    {
        $this->created_at = $created_at;

        return $this;
    }
}
