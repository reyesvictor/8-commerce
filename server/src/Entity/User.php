<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\SerializedName;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"user","review"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Groups({"user","review"})
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=180, unique=false,nullable=true)
     * @Groups({"user","review"})
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=180, unique=false,nullable=true)
     * @Groups({"user","review"})
     */
    private $lastname;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"user"})
     */
    private $created_at;

    /**
     * @ORM\OneToMany(targetEntity=CardCredentials::class, mappedBy="user")
     */
    private $cardCredentials;

    /**
     * @ORM\OneToMany(targetEntity=AddressShipping::class, mappedBy="user")
     * @Groups({"user_address"})
     * @SerializedName("shippingAddress")
     */
    private $addressShippings;

    /**
     * @ORM\OneToMany(targetEntity=AddressBilling::class, mappedBy="user")
     * @Groups({"user_address"})
     * @SerializedName("billingAddress")
     */
    private $addressBillings;

    /**
     * @ORM\OneToMany(targetEntity=UserOrder::class, mappedBy="user")
     * @Groups({"user_orders"})
     */
    private $userOrders;

    /**
     * @ORM\OneToMany(targetEntity=Review::class, mappedBy="user")
     */
    private $reviews;

    public function __construct()
    {
        $this->cardCredentials = new ArrayCollection();
        $this->addressShippings = new ArrayCollection();
        $this->addressBillings = new ArrayCollection();
        $this->userOrders = new ArrayCollection();
        $this->reviews = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */

    public function getFirstName(): string
    {
        return (string) $this->firstname;
    }

    public function setFirstName(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastName(): string
    {
        return (string) $this->lastname;
    }

    public function setLastName(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }


    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }
    
    public function getUsername() {}

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
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

    /**
     * @return Collection|CardCredentials[]
     */
    public function getCardCredentials(): Collection
    {
        return $this->cardCredentials;
    }

    public function addCardCredential(CardCredentials $cardCredential): self
    {
        if (!$this->cardCredentials->contains($cardCredential)) {
            $this->cardCredentials[] = $cardCredential;
            $cardCredential->setUser($this);
        }

        return $this;
    }

    public function removeCardCredential(CardCredentials $cardCredential): self
    {
        if ($this->cardCredentials->contains($cardCredential)) {
            $this->cardCredentials->removeElement($cardCredential);
            // set the owning side to null (unless already changed)
            if ($cardCredential->getUser() === $this) {
                $cardCredential->setUser(null);
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
            $addressShipping->setUser($this);
        }

        return $this;
    }

    public function removeAddressShipping(AddressShipping $addressShipping): self
    {
        if ($this->addressShippings->contains($addressShipping)) {
            $this->addressShippings->removeElement($addressShipping);
            // set the owning side to null (unless already changed)
            if ($addressShipping->getUser() === $this) {
                $addressShipping->setUser(null);
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
            $addressBilling->setUser($this);
        }

        return $this;
    }

    public function removeAddressBilling(AddressBilling $addressBilling): self
    {
        if ($this->addressBillings->contains($addressBilling)) {
            $this->addressBillings->removeElement($addressBilling);
            // set the owning side to null (unless already changed)
            if ($addressBilling->getUser() === $this) {
                $addressBilling->setUser(null);
            }
        }

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
            $userOrder->setUser($this);
        }

        return $this;
    }

    public function removeUserOrder(UserOrder $userOrder): self
    {
        if ($this->userOrders->contains($userOrder)) {
            $this->userOrders->removeElement($userOrder);
            // set the owning side to null (unless already changed)
            if ($userOrder->getUser() === $this) {
                $userOrder->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Review[]
     */
    public function getReviews(): Collection
    {
        return $this->reviews;
    }

    public function addReview(Review $review): self
    {
        if (!$this->reviews->contains($review)) {
            $this->reviews[] = $review;
            $review->setUser($this);
        }

        return $this;
    }

    public function removeReview(Review $review): self
    {
        if ($this->reviews->contains($review)) {
            $this->reviews->removeElement($review);
            // set the owning side to null (unless already changed)
            if ($review->getUser() === $this) {
                $review->setUser(null);
            }
        }

        return $this;
    }
}
