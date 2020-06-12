<?php

namespace App\Entity;

use App\Repository\RegionRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=RegionRepository::class)
 */
class Region
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"shipping", "user_address"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"shipping", "user_address"})
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity=ShippingPricing::class, mappedBy="region")
     */
    private $shippingPricings;

    /**
     * @ORM\OneToMany(targetEntity=AddressShipping::class, mappedBy="region")
     */
    private $addressShippings;

    /**
     * @ORM\OneToMany(targetEntity=AddressBilling::class, mappedBy="region")
     */
    private $addressBillings;

    public function __construct()
    {
        $this->shippingPricings = new ArrayCollection();
        $this->addressShippings = new ArrayCollection();
        $this->addressBillings = new ArrayCollection();
    }

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

    /**
     * @return Collection|ShippingPricing[]
     */
    public function getShippingPricings(): Collection
    {
        return $this->shippingPricings;
    }

    public function addShippingPricing(ShippingPricing $shippingPricing): self
    {
        if (!$this->shippingPricings->contains($shippingPricing)) {
            $this->shippingPricings[] = $shippingPricing;
            $shippingPricing->setRegion($this);
        }

        return $this;
    }

    public function removeShippingPricing(ShippingPricing $shippingPricing): self
    {
        if ($this->shippingPricings->contains($shippingPricing)) {
            $this->shippingPricings->removeElement($shippingPricing);
            // set the owning side to null (unless already changed)
            if ($shippingPricing->getRegion() === $this) {
                $shippingPricing->setRegion(null);
            }
        }

        return $this;
    }
    
    /**
     * @return Collection|AddressShipping[]
     */
    public function getAddressShippings(): Collection
    {
        return $this->addressShippings;
    }

    public function addAddressShipping(AddressShipping $addressShipping): self
    {
        if (!$this->addressShippings->contains($addressShipping)) {
            $this->addressShippings[] = $addressShipping;
            $addressShipping->setRegion($this);
        }

        return $this;
    }

    public function removeAddressShipping(AddressShipping $addressShipping): self
    {
        if ($this->addressShippings->contains($addressShipping)) {
            $this->addressShippings->removeElement($addressShipping);
            // set the owning side to null (unless already changed)
            if ($addressShipping->getRegion() === $this) {
                $addressShipping->setRegion(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|AddressBilling[]
     */
    public function getAddressBillings(): Collection
    {
        return $this->addressBillings;
    }

    public function addAddressBilling(AddressBilling $addressBilling): self
    {
        if (!$this->addressBillings->contains($addressBilling)) {
            $this->addressBillings[] = $addressBilling;
            $addressBilling->setRegion($this);
        }

        return $this;
    }

    public function removeAddressBilling(AddressBilling $addressBilling): self
    {
        if ($this->addressBillings->contains($addressBilling)) {
            $this->addressBillings->removeElement($addressBilling);
            // set the owning side to null (unless already changed)
            if ($addressBilling->getRegion() === $this) {
                $addressBilling->setRegion(null);
            }
        }

        return $this;
    }
}
