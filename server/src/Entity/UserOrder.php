<?php

namespace App\Entity;

use App\Repository\UserOrderRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Mapping\ClassMetadata;
use Symfony\Component\Serializer\Annotation\SerializedName;
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
     * @Groups({"user_address", "user_orders", "user_order_details"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="userOrders")
     * @ORM\JoinColumn(nullable=true)
     */
    private $user;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"user_address", "user_orders", "user_order_details"})
     */
    private $status;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user_address", "user_orders", "user_order_details"})
     */
    private $trackingNumber;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"user_address", "user_orders", "user_order_details"})
     */
    private $createdAt;

    /**
     * @ORM\ManyToOne(targetEntity=AddressShipping::class, inversedBy="userOrders")
     * @ORM\JoinColumn(nullable=false)
     * @SerializedName("shippingAddress")
     * @Groups({"user_address", "user_order_details"})
     */
    private $addressShipping;

    /**
     * @ORM\ManyToOne(targetEntity=AddressBilling::class, inversedBy="userOrders")
     * @ORM\JoinColumn(nullable=false)
     * @SerializedName("billingAddress")
     * @Groups({"user_address", "user_order_details"})
     */
    private $addressBilling;

    /**
     * @ORM\Column(type="float")
     * @Groups({"user_orders", "user_order_details", "user_order_details"})
     */
    private $cost;

    /**
     * @ORM\OneToMany(targetEntity=UserOrderSubproduct::class, mappedBy="userOrder", orphanRemoval=true)
     * @Groups("user_order_details")
     * @SerializedName("subproducts")
     */
    private $userOrderSubproducts;

    /**
     * @ORM\ManyToOne(targetEntity=PromoCode::class)
     */
    private $promoCode;

    /**
     * @ORM\ManyToOne(targetEntity=Packaging::class)
     * @Groups({"user_order_details", "user_orders"})
     */
    private $packaging;


    public function __construct()
    {
        $this->userOrderSubproducts = new ArrayCollection();
    }

    public static function loadValidatorMetadata(ClassMetadata $metadata)
    {
        $metadata->addPropertyConstraint('status', new Assert\NotBlank());
        $metadata->addPropertyConstraint('trackingNumber', new Assert\NotBlank());
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

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getCost(): ?float
    {
        return $this->cost;
    }

    public function setCost(float $cost): self
    {
        $this->cost = $cost;

        return $this;
    }

    /**
     * @return Collection|UserOrderSubproduct[]
     */
    public function getUserOrderSubproducts(): Collection
    {
        return $this->userOrderSubproducts;
    }

    public function addUserOrderSubproduct(UserOrderSubproduct $userOrderSubproduct): self
    {
        if (!$this->userOrderSubproducts->contains($userOrderSubproduct)) {
            $this->userOrderSubproducts[] = $userOrderSubproduct;
            $userOrderSubproduct->setUserOrder($this);
        }

        return $this;
    }

    public function removeUserOrderSubproduct(UserOrderSubproduct $userOrderSubproduct): self
    {
        if ($this->userOrderSubproducts->contains($userOrderSubproduct)) {
            $this->userOrderSubproducts->removeElement($userOrderSubproduct);
            // set the owning side to null (unless already changed)
            if ($userOrderSubproduct->getUserOrder() === $this) {
                $userOrderSubproduct->setUserOrder(null);
            }
        }

        return $this;
    }

    public function getPromoCode(): ?PromoCode
    {
        return $this->promoCode;
    }

    public function setPromoCode(?PromoCode $promoCode): self
    {
        $this->promoCode = $promoCode;

        return $this;
    }

    public function getPackaging(): ?Packaging
    {
        return $this->packaging;
    }

    public function setPackaging(?Packaging $packaging): self
    {
        $this->packaging = $packaging;

        return $this;
    }
}
