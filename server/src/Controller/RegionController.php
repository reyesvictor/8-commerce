<?php

namespace App\Controller;

use App\Entity\Subproduct;
use App\Repository\ProductRepository;
use App\Repository\SubproductRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Image;
use App\Entity\Region;
use App\Repository\RegionRepository;

use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class RegionController extends AbstractController
{
    /**
     * @Route("/api/region", name="region_index", methods="GET")
     */
    public function index(RegionRepository $regionRepository)
    {
        $category = $regionRepository->findAll();
        return $this->json($category, 200, [],['groups' => 'shipping']);
    }

    /**
     * @Route("/api/region", name="region_create", methods="POST")
     */
    public function region_create(Request $request ,RegionRepository $regionRepository,EntityManagerInterface $em)
    { 
        $req = json_decode($request->getContent());
        
        $find = $regionRepository->findOneBy(['name' => $req->name]);

        if($find){
            return $this->json(['message' => 'This region already exist'], 400, []);
        }
        else{
            $region  = new Region();
            $region->setName($req->name);
            $em->persist($region);
            $em->flush();
            return $this->json(['message'=>'Region successfully created',$region], 200);
        }
    }

    /**
     * @Route("/api/region/{id}", name="region_remove", methods="DELETE", requirements={"id":"\d+"})
     */
    public function region_remove(Request $request ,RegionRepository $regionRepository,EntityManagerInterface $em)
    { 
        $region = $regionRepository->findOneBy(['id' => $request->attributes->get('id')]);

        if ($region) {
            $em->remove($region);
            $em->flush();

            return $this->json([
                'message' => 'region removed',
                'product' => $region
            ], 200, [], ['groups' => 'shipping']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/region/{id}", name="region_details", methods="GET", requirements={"id":"\d+"})
     */
    public function regionDetails(Request $request, RegionRepository $regionRepository)
    {
        $region = $regionRepository->findOneBy(['id' => $request->attributes->get('id')]);
        if ($region) {
            return $this->json($region, 200, [], ['groups' => 'shipping']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/region/{id}", name="region_update", methods="PUT",requirements={"id":"\d+"})
     */
    public function regionUpdate(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, RegionRepository $regionRepository)
    {
        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            $region = $regionRepository->findOneBy(['id' => $request->attributes->get('id')]);
            
            if ($region) {
                if (!isset($req->name)) {
                    return $this->json(['message' => 'name is undefined'], 404, []);
                }
                $region->setName($req->name);

                $error = $validator->validate($region);
                if (count($error) > 0) return $this->json($error, 400);
                $em->persist($region);
                $em->flush();

                return $this->json($region, 200, [], ['groups' => 'shipping']);
            } else {
                return $this->json(['message' => 'category not found'], 404, []);
            }
        } catch (NotEncodableValueException $e) {
            return $this->json($e->getMessage(), 400);
        }
    }
}