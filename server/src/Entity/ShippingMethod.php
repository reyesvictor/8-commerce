<?php

namespace App\Entity;

use App\Repository\ShippingMethodRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ShippingMethodRepository::class)
 */
class ShippingMethod
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"shipping"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"shipping"})
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity=ShippingPricing::class, mappedBy="shippingMethod",orphanRemoval=true, cascade={"persist", "remove"}))
     * @Groups({"shipping"})
     */
    private $shippingPricings;

    public function __construct()
    {
        $this->shippingPricings = new ArrayCollection();
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
            $shippingPricing->setShippingMethod($this);
        }

        return $this;
    }

    public function removeShippingPricing(ShippingPricing $shippingPricing): self
    {
        if ($this->shippingPricings->contains($shippingPricing)) {
            $this->shippingPricings->removeElement($shippingPricing);
            // set the owning side to null (unless already changed)
            if ($shippingPricing->getShippingMethod() === $this) {
                $shippingPricing->setShippingMethod(null);
            }
        }

        return $this;
    }
}
