<?php

namespace App\Entity;

use App\Repository\AddressBillingRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Mapping\ClassMetadata;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=AddressBillingRepository::class)
 */
class AddressBilling
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"user_address"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Region::class, inversedBy="addressBillings")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user_address", "user_order_details"})
     */
    private $region;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user_address", "user_order_details"})
     */
    private $country;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user_address", "user_order_details"})
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user_address", "user_order_details"})
     */
    private $postcode;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user_address", "user_order_details"})
     */
    private $address;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="addressBillings")
     */
    private $user;

    /**
     * @ORM\OneToMany(targetEntity=UserOrder::class, mappedBy="addressBilling")
     */
    private $userOrders;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user_address", "user_order_details"})
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user_address", "user_order_details"})
     */
    private $lastname;

    public function __construct()
    {
        $this->userOrders = new ArrayCollection();
    }

    public static function loadValidatorMetadata(ClassMetadata $metadata)
    {
        $metadata->addPropertyConstraint('country', new Assert\NotBlank());
        $metadata->addPropertyConstraint('city', new Assert\NotBlank());
        $metadata->addPropertyConstraint('postcode', new Assert\NotBlank());
        $metadata->addPropertyConstraint('address', new Assert\NotBlank());
        $metadata->addPropertyConstraint('firstname', new Assert\NotBlank());
        $metadata->addPropertyConstraint('lastname', new Assert\NotBlank());
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(string $country): self
    {
        $this->country = $country;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getPostcode(): ?string
    {
        return $this->postcode;
    }

    public function setPostcode(string $postcode): self
    {
        $this->postcode = $postcode;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): self
    {
        $this->address = $address;

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

    /**
     * @return Collection|UserOrder[]
     */
    public function getUserOrders(): Collection
    {
        return $this->userOrders;
    }

    public function addUserOrder(UserOrder $userOrder): self
    {
        if (!$this->userOrders->contains($userOrder)) {
            $this->userOrders[] = $userOrder;
            $userOrder->setAddressBilling($this);
        }

        return $this;
    }

    public function removeUserOrder(UserOrder $userOrder): self
    {
        if ($this->userOrders->contains($userOrder)) {
            $this->userOrders->removeElement($userOrder);
            // set the owning side to null (unless already changed)
            if ($userOrder->getAddressBilling() === $this) {
                $userOrder->setAddressBilling(null);
            }
        }

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
