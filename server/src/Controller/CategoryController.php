<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\SubCategory;
use App\Repository\ImageRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\CategoryRepository;
use App\Repository\SubCategoryRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;


use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

class CategoryController extends AbstractController
{


    /**
     * @Route("/api/category", name="category_index", methods="GET")
     */
    public function index(Request $request, CategoryRepository $categoryRepository)
    {

        $count = $categoryRepository->countTotalResults();
        $categories = $categoryRepository->findBy([], null, $request->query->get('limit'), $request->query->get('offset'));

        return $this->json(['nbResults' => $count, 'data' => $categories], 200, [], ['groups' => 'category']);
    }


    /**
     * @Route("/api/category/create/{category}", name="create_category", methods="POST")
     */
    public function categoryCreate(Request $request, EntityManagerInterface $em,CategoryRepository $categoryRepository)
    {
        $newCat = $request->attributes->get('category');
        $find = $categoryRepository->findOneBy(['name' => $newCat ]);
        if($find){
            return $this->json(['message' => 'category already exist'], 400, []);
        }
        else{
            $category = new Category();
            $category->setName($newCat);
            $em->persist($category);
            $em->flush();
            return $this->json(['message' => 'category successfully created'], 200, []);
        }
    }

    /**
     * @Route("/api/category/{id}", name="remove_category", methods="DELETE")
     */
    public function categoryRemove(Request $request, EntityManagerInterface $em,CategoryRepository $categoryRepository)
    {
        $id = $request->attributes->get('id');
        $category = $categoryRepository->findOneBy(['id' => $id ]);
        if ($category) {
            $em->remove($category);
            $em->flush();

            return $this->json(['message' => 'Category successfully removed'], 200, []);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/category/{id}", name="category_details", methods="GET", requirements={"id":"\d+"})
     */
    public function categoryDetails(Request $request, CategoryRepository $CatRepository)
    {
        $Category = $CatRepository->findOneBy(['id' => $request->attributes->get('id')]);
        if ($Category) {
            return $this->json($Category, 200, [], ['groups' => 'category']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

      /**
     * @Route("/api/category/{id}", name="category_update", methods="PUT",requirements={"id":"\d+"})
     */
    public function categoryUpdate(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, CategoryRepository $categoryRepository)
    {
        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            $category = $categoryRepository->findOneBy(['id' => $request->attributes->get('id')]);
            
            if ($category) {
                if (isset($req->name)) {
                    $category->setName($req->name);
                }

                $error = $validator->validate($category);
                if (count($error) > 0) return $this->json($error, 400);
                $em->persist($category);
                $em->flush();

                return $this->json($category, 200, [], ['groups' => 'category']);
            } else {
                return $this->json(['message' => 'category not found'], 404, []);
            }
        } catch (NotEncodableValueException $e) {
            return $this->json($e->getMessage(), 400);
        }
    }

    /**
     * @Route("/api/category/search/{search}", name="search_category", methods="GET")
     */
    public function categorySearch(Request $request, CategoryRepository $categoryRepository)
    {
        $result = $categoryRepository->findSearchResult($request->attributes->get('search'), $request->query->get('limit'), $request->query->get('offset'));
        return $this->json($result);
    }

    /**
     * @Route("/api/category/migrate", name="category_migrate", methods="PUT")
     */
    public function categoryMigrate(Request $request, EntityManagerInterface $em,SubCategoryRepository $subcategory,CategoryRepository $categoryrepo)
    {
        $jsonContent = $request->getContent();
        $req = json_decode($jsonContent);

        $subcategories = $subcategory->findBy(['Category' => $req->oldcategory]);
        if(!$subcategories){
            return $this->json(['message' => 'SubCategory not found for this Id'], 404);
        }
        $newcategory = $categoryrepo->findOneBy(['id' => $req->newcategory]);
        if(!$newcategory){
            return $this->json(['message' => 'Category not found for this Id'], 404);
        }

        foreach($subcategories as $subcategory){ 
            $subcategory->setCategory($newcategory);
            $em->persist($subcategory);
        }

        $em->flush();

        return $this->json(['message' => 'Subcategory/s has been successfully migrated'],200);
    }

}