<?php

namespace App\Entity;

use App\Repository\UserOrderSubproductRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=UserOrderSubproductRepository::class)
 */
class UserOrderSubproduct
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=UserOrder::class, inversedBy="userOrderSubproducts")
     * @ORM\JoinColumn(nullable=false)
     */
    private $userOrder;

    /**
     * @ORM\ManyToOne(targetEntity=Subproduct::class, inversedBy="userOrderSubproducts")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user_order_details"})
     */
    private $subproduct;

    /**
     * @ORM\Column(type="float")
     * @Groups({"user_order_details"})
     */
    private $price;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user_order_details"})
     */
    private $promo;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserOrder(): ?UserOrder
    {
        return $this->userOrder;
    }

    public function setUserOrder(?UserOrder $userOrder): self
    {
        $this->userOrder = $userOrder;

        return $this;
    }

    public function getSubproduct(): ?Subproduct
    {
        return $this->subproduct;
    }

    public function setSubproduct(?Subproduct $subproduct): self
    {
        $this->subproduct = $subproduct;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getPromo(): ?int
    {
        return $this->promo;
    }

    public function setPromo(?int $promo): self
    {
        $this->promo = $promo;

        return $this;
    }
}
