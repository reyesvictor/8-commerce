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
     * @Groups({"supplier", "supplier_details", "supplierOrders", "supplier_order_details"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"supplier", "supplier_details", "supplierOrders", "supplier_order_details"})
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

    public function __construct()
    {
        $this->supplierOrders = new ArrayCollection();
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
}
