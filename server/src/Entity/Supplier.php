<?php

namespace App\Entity;

use App\Repository\SupplierRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Mapping\ClassMetadata;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=SupplierRepository::class)
 * @UniqueEntity("name")
 */
class Supplier
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"supplier", "supplier_details", "supplierOrders", "supplier_order_details", "products"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"supplier", "supplier_details", "supplierOrders", "supplier_order_details", "products"})
     * @Assert\Length(
     * min = 2,
     * minMessage = "Supplier name must be at least {{ limit }} characters long",
     * allowEmptyString = false
     * )
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity=SupplierOrder::class, mappedBy="supplier")
     * @Groups("supplier_details")
     */
    private $supplierOrders;

    /**
     * @ORM\OneToMany(targetEntity=Product::class, mappedBy="supplier")
     * @Groups("supplier_products")
     */
    private $product;

    public function __construct()
    {
        $this->supplierOrders = new ArrayCollection();
        $this->product = new ArrayCollection();
    }

    public static function loadValidatorMetadata(ClassMetadata $metadata)
    {
        $metadata->addPropertyConstraint('name', new Assert\NotBlank());
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
     * @return Collection|SupplierOrder[]
     */
    public function getSupplierOrders(): Collection
    {
        return $this->supplierOrders;
    }

    public function addSupplierOrder(SupplierOrder $supplierOrder): self
    {
        if (!$this->supplierOrders->contains($supplierOrder)) {
            $this->supplierOrders[] = $supplierOrder;
            $supplierOrder->setSupplier($this);
        }

        return $this;
    }

    public function removeSupplierOrder(SupplierOrder $supplierOrder): self
    {
        if ($this->supplierOrders->contains($supplierOrder)) {
            $this->supplierOrders->removeElement($supplierOrder);
            // set the owning side to null (unless already changed)
            if ($supplierOrder->getSupplier() === $this) {
                $supplierOrder->setSupplier(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Product[]
     */
    public function getProduct(): Collection
    {
        return $this->product;
    }

    public function addProduct(Product $product): self
    {
        if (!$this->product->contains($product)) {
            $this->product[] = $product;
            $product->setSupplier($this);
        }

        return $this;
    }

    public function removeProduct(Product $product): self
    {
        if ($this->product->contains($product)) {
            $this->product->removeElement($product);
            // set the owning side to null (unless already changed)
            if ($product->getSupplier() === $this) {
                $product->setSupplier(null);
            }
        }

        return $this;
    }
}
