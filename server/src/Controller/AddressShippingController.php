<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use App\Entity\AddressShipping;
use App\Repository\UserRepository;
use App\Repository\RegionRepository;
use App\Repository\AddressShippingRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AddressShippingController extends AbstractController
{
    /**
     * @Route("/api/addressshipping", name="addressshipping_index", methods="GET")
     */
    public function index(AddressShippingRepository $addressShippingRepository)
    {
        $addressShipping = $addressShippingRepository->findAll();
        return $this->json($addressShipping, 200, [],['groups' => 'user_address']);
    }

    /**
     * @Route("/api/addressshipping", name="addressshipping_create", methods="POST")
     */
    public function addressShippingCreate(ValidatorInterface $validator,SerializerInterface $serializer,Request $request ,RegionRepository $regionRepository,UserRepository $userRepository,EntityManagerInterface $em)
    { 
        $jsonContent = $request->getContent();
        $req = json_decode($jsonContent);
    
        $addressShipping = $serializer->deserialize($jsonContent, AddressShipping::class, 'json', [
            AbstractNormalizer::IGNORED_ATTRIBUTES => ['user', 'region'],
            ObjectNormalizer::DISABLE_TYPE_ENFORCEMENT => true
        ]);
   
        if(!isset($req->region)){
            return $this->json(['message' => 'Region is undefined'],400);
        }
        $region = $regionRepository->findOneBy(['id' => $req->region]);
        if(!$region){
            return $this->json(['message' => 'Region not found'],404);
        }
        $addressShipping->setRegion($region);

        if(isset($req->user)){
            $user = $userRepository->findOneBy(['id' => $req->user]);
            if(!$user){
                return $this->json(['message' => 'User not found'],404);
            }
            $addressShipping->setUser($user);
        }

        $error = $validator->validate($addressShipping);
        if (count($error) > 0) return $this->json($error, 400);

        $em->persist($addressShipping);
        $em->flush();

        return $this->json(['message'=>'Address shipping successfully created','adressShipping' => $addressShipping], 200,[],['groups' => 'user_address']);
    }

    /**
     * @Route("/api/addressshipping/{id}", name="addressshipping_remove", methods="DELETE", requirements={"id":"\d+"})
     */
    public function addressShippingRemove(Request $request ,AddressShippingRepository $addressShippingRepository,EntityManagerInterface $em)
    { 
        $addressShipping = $addressShippingRepository->findOneBy(['id' => $request->attributes->get('id')]);

        if ($addressShipping) {
            $em->remove($addressShipping);
            $em->flush();

            return $this->json([
                'message' => 'addressShipping removed',
                'addressShipping' => $addressShipping
            ], 200, [], ['groups' => 'user_address']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/addressshipping/{id}", name="addressshipping_details", methods="GET", requirements={"id":"\d+"})
     */
    public function addressShippingDetails(Request $request, AddressShippingRepository $addressShippingRepository)
    {
        $addressShipping = $addressShippingRepository->findOneBy(['id' => $request->attributes->get('id')]);
        if ($addressShipping) {
            return $this->json($addressShipping, 200, [], ['groups' => 'user_address']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/addressshipping/{id}", name="addressshipping_update", methods="PUT",requirements={"id":"\d+"})
     */
    public function addressShippingUpdate(SerializerInterface $serializer,Request $request, EntityManagerInterface $em, ValidatorInterface $validator, UserRepository $userRepository,RegionRepository $regionRepository,AddressShippingRepository $addressShippingRepository)
    {
        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            $addressShipping = $addressShippingRepository->findOneBy(['id' => $request->attributes->get('id')]);
            
            if ($addressShipping) {

                try {
                    $addressShipping = $serializer->deserialize($jsonContent, AddressShipping::class, 'json', [
                        AbstractNormalizer::IGNORED_ATTRIBUTES => ['region', 'user'],
                        AbstractNormalizer::OBJECT_TO_POPULATE => $addressShipping
                    ]);
                } catch (NotNormalizableValueException $e) {
                    return $this->json(['message' => $e->getMessage()], 400, []);
                }   
                
                if (isset($req->region)) {
                    $region = $regionRepository->findOneBy(['id' => $req->region]);
                    if(!$region){
                        return $this->json(['message' => 'Region not found'],404);
                    }
                    $addressShipping->setRegion($region);
                }

                if (isset($req->user)) {
                    $user = $userRepository->findOneBy(['id' => $req->user]);
                    if(!$user){
                        return $this->json(['message' => 'User not found'],404);
                    }
                    $addressShipping->setUser($user);
                }

                $error = $validator->validate($addressShipping);
                if (count($error) > 0) return $this->json($error, 400);
                $em->persist($addressShipping);
                $em->flush();

                return $this->json($addressShipping, 200, [], ['groups' => 'user_address']);
            } else {
                return $this->json(['message' => 'Address shipping not found'], 404, []);
            }
        } catch (NotEncodableValueException $e) {
            return $this->json($e->getMessage(), 400);
        }
    }
}