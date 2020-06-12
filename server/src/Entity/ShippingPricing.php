<?php

namespace App\Entity;

use App\Repository\ShippingPricingRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ShippingPricingRepository::class)
 */
class ShippingPricing
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"shipping"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=ShippingMethod::class, inversedBy="shippingPricings")
     * @ORM\JoinColumn(nullable=false)
     */
    private $shippingMethod;

    /**
     * @ORM\ManyToOne(targetEntity=Region::class, inversedBy="shippingPricings")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"shipping"})
     */
    private $region;

    /**
     * @ORM\Column(type="float")
     * @Groups({"shipping"})
     */
    private $pricePerKilo;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"shipping"})
     */
    private $duration;

    /**
     * @ORM\Column(type="float")
     * @Groups({"shipping"})
     */
    private $basePrice;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getShippingMethod(): ?ShippingMethod
    {
        return $this->shippingMethod;
    }

    public function setShippingMethod(?ShippingMethod $shippingMethod): self
    {
        $this->shippingMethod = $shippingMethod;

        return $this;
    }

    public function getRegion(): ?Region
    {
        return $this->region;
    }

    public function setRegion(?Region $region): self
    {
        $this->region = $region;

        return $this;
    }

    public function getPricePerKilo(): ?float
    {
        return $this->pricePerKilo;
    }

    public function setPricePerKilo(float $pricePerKilo): self
    {
        $this->pricePerKilo = $pricePerKilo;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): self
    {
        $this->duration = $duration;

        return $this;
    }

    public function getBasePrice(): ?float
    {
        return $this->basePrice;
    }

    public function setBasePrice(float $basePrice): self
    {
        $this->basePrice = $basePrice;

        return $this;
    }
}
