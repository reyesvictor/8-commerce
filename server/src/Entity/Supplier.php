<?php

namespace App\Entity;

use App\Repository\SupplierRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=SupplierRepository::class)
 */
class Supplier
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity=SupplierOrder::class, mappedBy="supplier")
     */
    private $supplierOrders;

    public function __construct()
    {
        $this->supplierOrders = new ArrayCollection();
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
