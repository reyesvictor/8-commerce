<?php

namespace App\Controller;

use App\Entity\Subproduct;
use App\Repository\ProductRepository;
use App\Repository\SubproductRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Image;
use App\Entity\Region;
use App\Entity\ShippingMethod;
use App\Repository\ShippingMethodRepository;

use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ShippingMethodController extends AbstractController
{

    /**
     * @Route("/api/shippingmethod", name="shippingmethod_index", methods="GET")
     */
    public function index(Request $request, ShippingMethodRepository $shippingMethodRepository)
    {
        $count = $shippingMethodRepository->countTotalResults();
        $shippingMethod = $shippingMethodRepository->findBy([], null, $request->query->get('limit'), $request->query->get('offset'));
        return $this->json(['nbResults' => $count, 'data' => $shippingMethod], 200, [], ['groups' => 'shipping']);
    }

    /**
     * @Route("/api/shippingmethod/{id}", name="shippingmethod_details", methods="GET", requirements={"id":"\d+"})
     */
    public function shippingMethodDetails(Request $request, ShippingMethodRepository $shippingMethodRepository)
    {
        $shippingMethod = $shippingMethodRepository->findOneBy(['id' => $request->attributes->get('id')]);
        if ($shippingMethod) {
            return $this->json($shippingMethod, 200, [], ['groups' => 'shipping']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/shippingmethod", name="shippingmethod_create", methods="POST")
     */
    public function shippingMethodCreate(Request $request ,ShippingMethodRepository $shippingMethodRepository,EntityManagerInterface $em)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $req = json_decode($request->getContent());
        
        $find = $shippingMethodRepository->findOneBy(['name' => $req->name]);

        if($find){
            return $this->json(['message' => 'This shipping method already exist'], 400, []);
        }
        else{
            $shippingMethod  = new ShippingMethod();
            $shippingMethod->setName($req->name);
            $em->persist($shippingMethod);
            $em->flush();
            return $this->json(['message'=>'Region successfully created',$shippingMethod], 200,[],['groups' => 'shipping']);
        }
    }

    /**
     * @Route("/api/shippingmethod/{id}", name="shippingmethod_remove", methods="DELETE", requirements={"id":"\d+"})
     */
    public function shippingMethodRemove(Request $request ,ShippingMethodRepository $shippingMethodRepository,EntityManagerInterface $em)
    { 
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $shippingMethod = $shippingMethodRepository->findOneBy(['id' => $request->attributes->get('id')]);

        if ($shippingMethod) {
            $em->remove($shippingMethod);
            $em->flush();

            return $this->json([
                'message' => 'region removed',
                'product' => $shippingMethod
            ], 200, [], ['groups' => 'shipping']);
        } else {
            return $this->json(['message' => 'ShippingMethod not found'], 404, []);
        }
    }

    /**
     * @Route("/api/shippingmethod/{id}", name="shippingmethod_update", methods="PUT",requirements={"id":"\d+"})
     */
    public function shippingMethodUpdate(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, ShippingMethodRepository $shippingMethodRepository)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            $shippingMethod = $shippingMethodRepository->findOneBy(['id' => $request->attributes->get('id')]);
            
            if ($shippingMethod) {
                if (!isset($req->name)) {
                    return $this->json(['message' => 'name is undefined'], 404, []);
                }
                $shippingMethod->setName($req->name);

                $error = $validator->validate($shippingMethod);
                if (count($error) > 0) return $this->json($error, 400);
                $em->persist($shippingMethod);
                $em->flush();

                return $this->json($shippingMethod, 200, [], ['groups' => 'shipping']);
            } else {
                return $this->json(['message' => 'category not found'], 404, []);
            }
        } catch (NotEncodableValueException $e) {
            return $this->json($e->getMessage(), 400);
        }
    }

}