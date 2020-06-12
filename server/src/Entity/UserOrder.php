<?php

namespace App\Entity;

use App\Repository\UserOrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=UserOrderRepository::class)
 */
class UserOrder
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToMany(targetEntity=Subproduct::class, inversedBy="userOrders")
     */
    private $subproduct;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $status;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $trackingNumber;

    /**
     * @ORM\Column(type="boolean")
     */
    private $packaging;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\ManyToOne(targetEntity=AddressShipping::class, inversedBy="userOrders")
     * @ORM\JoinColumn(nullable=false)
     */
    private $addressShipping;

    /**
     * @ORM\ManyToOne(targetEntity=AddressBilling::class, inversedBy="userOrders")
     * @ORM\JoinColumn(nullable=false)
     */
    private $addressBilling;

    public function __construct()
    {
        $this->subproduct = new ArrayCollection();
    }

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

    public function getTrackingNumber(): ?string
    {
        return $this->trackingNumber;
    }

    public function setTrackingNumber(string $trackingNumber): self
    {
        $this->trackingNumber = $trackingNumber;

        return $this;
    }

    public function getPackaging(): ?bool
    {
        return $this->packaging;
    }

    public function setPackaging(bool $packaging): self
    {
        $this->packaging = $packaging;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return Collection|Subproduct[]
     */
    public function getSubproduct(): Collection
    {
        return $this->subproduct;
    }

    public function addSubproduct(Subproduct $subproduct): self
    {
        if (!$this->subproduct->contains($subproduct)) {
            $this->subproduct[] = $subproduct;
        }

        return $this;
    }

    public function removeSubproduct(Subproduct $subproduct): self
    {
        if ($this->subproduct->contains($subproduct)) {
            $this->subproduct->removeElement($subproduct);
        }

        return $this;
    }

    public function getAddressShipping(): ?AddressShipping
    {
        return $this->addressShipping;
    }

    public function setAddressShipping(?AddressShipping $addressShipping): self
    {
        $this->addressShipping = $addressShipping;

        return $this;
    }

    public function getAddressBilling(): ?AddressBilling
    {
        return $this->addressBilling;
    }

    public function setAddressBilling(?AddressBilling $addressBilling): self
    {
        $this->addressBilling = $addressBilling;

        return $this;
    }
}
