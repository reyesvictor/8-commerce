<?php

namespace App\Controller;

use App\Entity\Subproduct;
use App\Repository\ProductRepository;
use App\Repository\SubproductRepository;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\ShippingPricing;
use App\Entity\Region;
use App\Repository\RegionRepository;
use App\Repository\ShippingPricingRepository;
use App\Repository\ShippingMethodRepository;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ShippingPricingController extends AbstractController
{

    /**
     * @Route("/api/shippingpricing", name="shippingpricing_index", methods="GET")
     */
    public function index(ShippingPricingRepository $shippingPricingRepository)
    {
        $shippingPricing = $shippingPricingRepository->findAll();
        return $this->json($shippingPricing, 200, [],['groups' => 'shipping']);
    }

    /**
     * @Route("/api/shippingpricing/{id}", name="shippingpricing_details", methods="GET", requirements={"id":"\d+"})
     */
    public function shippingPricingDetails(Request $request, ShippingPricingRepository $shippingPricingRepository)
    {
        $shippingPricing = $shippingPricingRepository->findOneBy(['id' => $request->attributes->get('id')]);
        if ($shippingPricing) {
            return $this->json($shippingPricing, 200, [], ['groups' => 'shipping']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/shippingpricing", name="shippingpricing_create", methods="POST")
     */
    public function shippingMethodCreate(Request $request ,ShippingPricingRepository $shippingPricingRepository,ShippingMethodRepository $shippingMethodRepository,RegionRepository $regionRepository,EntityManagerInterface $em)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $jsonContent = $request->getContent();
        $req = json_decode($jsonContent);
   
        if(!isset($req->region)){
            return $this->json(['Region is undefined'],400);
        }
        if(!isset($req->shippingMethod)){
            return $this->json(['Shipping Method is undefined'],400);
        }

        $find = $shippingPricingRepository->findOneBy(['shippingMethod' => $req->shippingMethod,'region'=> $req->region]);

        if($find){
            return $this->json(['message' => 'This shipping method with this method and region already exist'], 400, []);
        }
        else{

            $region = $regionRepository->findOneBy(['id' => $req->region]);
            if(!$region){
                return $this->json(['Region not found'],404);
            }
        
            $shippingMethod = $shippingMethodRepository->findOneBy(['id' => $req->shippingMethod]);
            if(!$shippingMethod){
                return $this->json(['Shipping method not found'],404);
            }

            if(!isset($req->pricePerKilo)){
                return $this->json(['Price per kilo is undefined'],400);
            }

            if(!isset($req->duration)){
                return $this->json(['Duration is undefined'],400);
            }

            if(!isset($req->basePrice)){
                return $this->json(['Base Price is undefined'],400);
            }
           

            $shippingPricing  = new ShippingPricing();
            $shippingPricing->setShippingMethod($shippingMethod);
            $shippingPricing->setRegion($region);
            $shippingPricing->setPricePerKilo($req->pricePerKilo);
            $shippingPricing->setDuration($req->duration);
            $shippingPricing->setBasePrice($req->basePrice);
            $em->persist($shippingPricing);
            $em->flush();
            return $this->json(['message'=>'Shipping Pricing successfully created',$shippingPricing], 200,[],['groups' => 'shipping']);
        }
    }


    /**
     * @Route("/api/shippingpricing/{id}", name="shippingpricing_remove", methods="DELETE", requirements={"id":"\d+"})
     */
    public function shippingPricingRemove(Request $request, ShippingPricingRepository $shippingPricingRepository, EntityManagerInterface $em)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $shippingPricing = $shippingPricingRepository->findOneBy(['id' => $request->attributes->get('id')]);

        if ($shippingPricing) {
            $em->remove($shippingPricing);
            $em->flush();

            return $this->json([
                'message' => 'Shipping pricing removed',
                'shippingPricing' => $shippingPricing
            ], 200, [], ['groups' => 'shipping']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/shippingpricing/{id}", name="shippingpricing_update", methods="PUT",requirements={"id":"\d+"})
     */
    public function shippingPricingUpdate(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, ShippingPricingRepository $shippingPricingRepository,ShippingMethodRepository $shippingMethodRepository,RegionRepository $regionRepository)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
     
            $shippingPricing = $shippingPricingRepository->findOneBy(['id' => $request->attributes->get('id')]);
            
            if ($shippingPricing) {

                if (isset($req->shippingMethod)) {
               
                    $shippingMethod = $shippingMethodRepository->findOneBy(['id' => $req->shippingMethod]); 
              
                    $shippingPricing->setShippingMethod($shippingMethod);
                }
                if (isset($req->region)) {
                    $shippingMethod = $regionRepository->findOneBy(['id' => $req->region]);
                    $shippingPricing->setRegion($shippingMethod);
                }
                if (isset($req->pricePerKilo)) {
                    $shippingPricing->setPricePerKilo($req->pricePerKilo);
                }
                if (isset($req->duration)) {
                    $shippingPricing->setDuration($req->duration);
                }
                if (isset($req->basePrice)) {
                    $shippingPricing->setBasePrice($req->basePrice);
                }

                $error = $validator->validate($shippingPricing);
                if (count($error) > 0) return $this->json($error, 400);
                $em->persist($shippingPricing);
                $em->flush();

                return $this->json($shippingPricing, 200, [], ['groups' => 'shipping']);
            } else {
                return $this->json(['message' => 'Shipping pricing not found'], 404, []);
            }
        } catch (NotEncodableValueException $e) {
            return $this->json($e->getMessage(), 400);
        }
    }

}