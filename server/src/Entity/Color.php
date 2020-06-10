<?php

namespace App\Entity;

use App\Repository\ColorRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ColorRepository::class)
 * @UniqueEntity("name")
 */
class Color
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"subproduct", "color","products", "supplier_order_details"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"subproduct", "color","products", "supplier_order_details"})
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity=Subproduct::class, mappedBy="color")
     */
    private $subproduct;

    public function __construct()
    {
        $this->subproduct = new ArrayCollection();
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
     * @return Collection|Subproduct[]
     */
    public function getSubproduct(): Collection
    {
        return $this->subproduct;
    }

    public function addSubproduct(Subproduct $subproduct): self
    {
        if (!$this->subproduct->contains($subproduct)) {
            $this->subproduct[] = $subproduct;
            $subproduct->setColor($this);
        }

        return $this;
    }

    public function removeSubproduct(Subproduct $subproduct): self
    {
        if ($this->subproduct->contains($subproduct)) {
            $this->subproduct->removeElement($subproduct);
            // set the owning side to null (unless already changed)
            if ($subproduct->getColor() === $this) {
                $subproduct->setColor(null);
            }
        }

        return $this;
    }
}
