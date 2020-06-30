<?php

namespace App\Controller;
use App\Repository\UserOrderSubproductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class UserOrderSubproductController extends AbstractController
{
    /**
     * @Route("/api/soldcategory", name="soldcategory", methods="GET")
     */
    public function soldCategory(UserOrderSubproductRepository $orderSubRepository)
    {
        $categories = $orderSubRepository->findCategorySoldProduct();
        if(!count($categories) > 0){
            return $this->json(['No product sold with a category',404]);
        }
        $soldCategory = array_count_values(array_column($categories,'name'));
        return $this->json([$soldCategory,200]);
    }

    /**
     * @Route("/api/soldsubcategory", name="soldsubcategory", methods="GET")
     */
    public function soldSubCategory(UserOrderSubproductRepository $orderSubRepository)
    {
        $subcategories = $orderSubRepository->findSubCategorySoldProduct();
        if(!count($subcategories) > 0){
            return $this->json(['No product sold with a subcategory',404]);
        }
        $soldSubCategory = array_count_values(array_column($subcategories,'name'));
        return $this->json([$soldSubCategory,200]);
    }
}