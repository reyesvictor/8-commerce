<?php

namespace App\Entity;

use App\Repository\SupplierOrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Mapping\ClassMetadata;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=SupplierOrderRepository::class)
 */
class SupplierOrder
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"supplierOrders", "supplier_details", "supplier_order_details"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Supplier::class, inversedBy="supplierOrders")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"supplierOrders", "supplier_order_details"})
     */
    private $supplier;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"supplierOrders", "supplier_order_details"})
     */
    private $our_address;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"supplier_details","supplierOrders", "supplier_order_details"})
     */
    private $status;

    /**
     * @ORM\Column(type="float")
     * @Groups({"supplier_details", "supplierOrders", "supplier_order_details"})
     */
    private $price;

    /**
     * @ORM\Column(type="date")
     * @Groups({"supplier_details", "supplierOrders", "supplier_order_details"})
     */
    private $arrival_date;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"supplier_details", "supplierOrders", "supplier_order_details"})
     */
    private $created_at;

    /**
     * @ORM\OneToMany(targetEntity=SupplierOrderSubproduct::class, mappedBy="supplierOrder")
     * @Groups("supplier_order_details")
     */
    private $supplierOrderSubproducts;

    public function __construct()
    {
        $this->supplierOrderSubproducts = new ArrayCollection();
    }

    public static function loadValidatorMetadata(ClassMetadata $metadata)
    {
        $metadata->addPropertyConstraint('our_address', new Assert\NotBlank());
        $metadata->addPropertyConstraint('price', new Assert\NotBlank());
        $metadata->addPropertyConstraint('price', new Assert\Type(['type' => ['integer', 'double', 'numeric']]));
        $metadata->addPropertyConstraint('arrival_date', new Assert\NotBlank());
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSupplier(): ?Supplier
    {
        return $this->supplier;
    }

    public function setSupplier(?Supplier $supplier): self
    {
        $this->supplier = $supplier;

        return $this;
    }

    public function getOurAddress(): ?string
    {
        return $this->our_address;
    }

    public function setOurAddress(string $our_address): self
    {
        $this->our_address = $our_address;

        return $this;
    }

    public function getStatus(): ?bool
    {
        return $this->status;
    }

    public function setStatus(?bool $status): self
    {
        $this->status = $status;

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

    public function getArrivalDate(): ?\DateTimeInterface
    {
        return $this->arrival_date;
    }

    public function setArrivalDate(\DateTimeInterface $arrival_date): self
    {
        $this->arrival_date = $arrival_date;

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

    /**
     * @return Collection|SupplierOrderSubproduct[]
     */
    public function getSupplierOrderSubproducts(): Collection
    {
        return $this->supplierOrderSubproducts;
    }

    public function addSupplierOrderSubproduct(SupplierOrderSubproduct $supplierOrderSubproduct): self
    {
        if (!$this->supplierOrderSubproducts->contains($supplierOrderSubproduct)) {
            $this->supplierOrderSubproducts[] = $supplierOrderSubproduct;
            $supplierOrderSubproduct->setSupplierOrder($this);
        }

        return $this;
    }

    public function removeSupplierOrderSubproduct(SupplierOrderSubproduct $supplierOrderSubproduct): self
    {
        if ($this->supplierOrderSubproducts->contains($supplierOrderSubproduct)) {
            $this->supplierOrderSubproducts->removeElement($supplierOrderSubproduct);
            // set the owning side to null (unless already changed)
            if ($supplierOrderSubproduct->getSupplierOrder() === $this) {
                $supplierOrderSubproduct->setSupplierOrder(null);
            }
        }

        return $this;
    }
}
