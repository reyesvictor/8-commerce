<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Mapping\ClassMetadata;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ProductRepository::class)
 */
class Product
{
    /**
     * @Groups({"products","category","subproduct", "supplier_order_details"})
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"products","category", "subproduct", "supplier_order_details"})
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"products","category"})
     */
    private $description;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"products","category"})
     */
    private $promo;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"products","category"})
     */
    private $created_at;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"products","category"})
     */
    private $clicks;

    /**
     * @ORM\OneToMany(targetEntity=Subproduct::class, mappedBy="product", orphanRemoval=true, cascade={"remove"}, cascade={"persist"})
     * @Groups("products")
     */
    private $subproducts;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"products","category"})
     */
    private $sex;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"products","category"})
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=SubCategory::class, inversedBy="Product")
     * @ORM\JoinColumn(nullable=false)
     * @Groups("products")
     */
    private $subCategory;



    public function __construct()
    {
        $this->subproducts = new ArrayCollection();
    }

    public static function loadValidatorMetadata(ClassMetadata $metadata)
    {
        $metadata->addPropertyConstraint('title', new Assert\NotBlank());
        $metadata->addPropertyConstraint('description', new Assert\NotBlank());
        $metadata->addPropertyConstraint('description', new Assert\Type(['type' => ['string']]));
        $metadata->addPropertyConstraint('status', new Assert\Type(['type' => ['bool']]));
        $metadata->addPropertyConstraint('sex', new Assert\NotBlank());
        $metadata->addPropertyConstraint('sex', new Assert\Type(['type' => ['alpha']]));
        $metadata->addPropertyConstraint('promo', new Assert\Type(['type' => ['integer']]));
    }

    public function getId(): ?int
    {
        return $this->id;
    }


    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getSex(): ?string
    {
        return $this->sex;
    }

    public function setSex(string $sex): self
    {
        $this->sex = $sex;

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

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeInterface $created_at): self
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getClicks(): ?int
    {
        return $this->clicks;
    }

    public function setClicks(?int $clicks): self
    {
        $this->clicks = $clicks;

        return $this;
    }

    /**
     * @return Collection|Subproduct[]
     */
    public function getSubproducts(): Collection
    {
        return $this->subproducts;
    }

    public function addSubproduct(Subproduct $subproduct): self
    {
        if (!$this->subproducts->contains($subproduct)) {
            $this->subproducts[] = $subproduct;
            $subproduct->setProduct($this);
        }

        return $this;
    }

    public function removeSubproduct(Subproduct $subproduct): self
    {
        if ($this->subproducts->contains($subproduct)) {
            $this->subproducts->removeElement($subproduct);
            // set the owning side to null (unless already changed)
            if ($subproduct->getProduct() === $this) {
                $subproduct->setProduct(null);
            }
        }

        return $this;
    }

    public function getStatus(): ?bool
    {
        return $this->status;
    }

    public function setStatus(bool $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getSubCategory(): ?SubCategory
    {
        return $this->subCategory;
    }

    public function setSubCategory(?SubCategory $subCategory): self
    {
        $this->subCategory = $subCategory;

        return $this;
    }

}
