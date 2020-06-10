<?php

namespace App\Entity;

use App\Repository\SupplierOrderSubproductRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=SupplierOrderSubproductRepository::class)
 */
class SupplierOrderSubproduct
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups("supplier_order_details")
     */
    private $quantity;

    /**
     * @ORM\ManyToOne(targetEntity=Subproduct::class, inversedBy="supplierOrderSubproducts")
     * @ORM\JoinColumn(nullable=false)
     * @Groups("supplier_order_details")
     */
    private $subproduct;

    /**
     * @ORM\ManyToOne(targetEntity=SupplierOrder::class, inversedBy="supplierOrderSubproducts")
     * @ORM\JoinColumn(nullable=false)
     */
    private $supplierOrder;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;

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

    public function getSupplierOrder(): ?SupplierOrder
    {
        return $this->supplierOrder;
    }

    public function setSupplierOrder(?SupplierOrder $supplierOrder): self
    {
        $this->supplierOrder = $supplierOrder;

        return $this;
    }
}
