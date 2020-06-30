<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Addressbilling;
use App\Repository\UserRepository;
use App\Repository\RegionRepository;
use App\Repository\AddressBillingRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;

class AddressBillingController extends AbstractController
{
    /**
     * @Route("/api/addressbilling", name="addressbilling_index", methods="GET")
     */
    public function index(AddressBillingRepository $addressBillingRepository)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $addressBillings = $addressBillingRepository->findAll();
        return $this->json($addressBillings, 200, [],['groups' => 'user_address']);
    }

    /**
     * @Route("/api/addressbilling", name="addressbilling_create", methods="POST")
     */
    public function addressBillingCreate(ValidatorInterface $validator,Request $request ,SerializerInterface $serializer,RegionRepository $regionRepository,UserRepository $userRepository,EntityManagerInterface $em)
    { 
        $jsonContent = $request->getContent();
        $req = json_decode($jsonContent);
        
        $addressbilling = $serializer->deserialize($jsonContent, AddressBilling::class, 'json', [
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
   
        if(isset($req->user)){
            $user = $userRepository->findOneBy(['id' => $req->user]);
            if(!$user){
                return $this->json(['message' => 'User not found'],404);
            }
            $addressbilling->setUser($user);
        }
        $addressbilling->setRegion($region);
   
        $error = $validator->validate($addressbilling);
        if (count($error) > 0) return $this->json($error, 400);

        $em->persist($addressbilling);
        $em->flush();

        return $this->json(['message'=>'Address billing successfully created','adressBilling' => $addressbilling], 200,[],['groups' => 'user_address']);
    }

    /**
     * @Route("/api/addressbilling/{id}", name="addressbilling_remove", methods="DELETE", requirements={"id":"\d+"})
     */
    public function addressBillingRemove(Request $request ,AddressBillingRepository $addressBillingRepository,EntityManagerInterface $em)
    { 
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        $user = $this->getUser();

        $addressbilling = $addressBillingRepository->findOneBy(['id' => $request->attributes->get('id')]);

        if ($addressbilling) {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            if(!isset($req->user_id) || $user->getId() != $req->user_id) return $this->json(['message' => 'user unauthorized'],403);

            $em->remove($addressbilling);
            $em->flush();

            return $this->json([
                'message' => 'addressbilling removed',
                'addressbilling' => $addressbilling
            ], 200, [], ['groups' => 'user_address']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/addressbilling/{id}", name="addressbilling_details", methods="GET", requirements={"id":"\d+"})
     */
    public function addressBillingDetails(Request $request, AddressBillingRepository $addressbillingRepository)
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        $user = $this->getUser();

        $addressbilling = $addressbillingRepository->findOneBy(['id' => $request->attributes->get('id')]);
        if ($addressbilling) {
            $userId = $request->query->get('user_id');
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            if(!isset($userId) || $user->getId() != $userId) return $this->json(['message' => 'user unauthorized'],403);

            return $this->json($addressbilling, 200, [], ['groups' => 'user_address']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/addressbilling/{id}", name="addressbilling_update", methods="PUT",requirements={"id":"\d+"})
     */
    public function addressBillingUpdate(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, SerializerInterface $serializer, UserRepository $userRepository,RegionRepository $regionRepository,AddressBillingRepository $addressbillingRepository)
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        $user = $this->getUser();
        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            if(!isset($req->user_id) || $user->getId() != $req->user_id) return $this->json(['message' => 'user unauthorized'],403);
            $addressbilling = $addressbillingRepository->findOneBy(['id' => $request->attributes->get('id')]);
            
            if ($addressbilling) {
                try {
                    $addressbilling = $serializer->deserialize($jsonContent, Addressbilling::class, 'json', [
                        AbstractNormalizer::IGNORED_ATTRIBUTES => ['region', 'user'],
                        AbstractNormalizer::OBJECT_TO_POPULATE => $addressbilling
                    ]);
                } catch (NotNormalizableValueException $e) {
                    return $this->json(['message' => $e->getMessage()], 400, []);
                }

                if (isset($req->region)) {
                    $region = $regionRepository->findOneBy(['id' => $req->region]);
                    if(!$region){
                        return $this->json(['message' => 'Region not found'],404);
                    }
                    $addressbilling->setRegion($region);
                }

                if (isset($req->user)) {
                    $user = $userRepository->findOneBy(['id' => $req->user]);
                    if(!$user){
                        return $this->json(['message' => 'User not found'],404);
                    }
                    $addressbilling->setUser($user);
                }

                $error = $validator->validate($addressbilling);
                if (count($error) > 0) return $this->json($error, 400);
                $em->persist($addressbilling);
                $em->flush();

                return $this->json($addressbilling, 200, [], ['groups' => 'user_address']);
            } else {
                return $this->json(['message' => 'Address Billing not found'], 404, []);
            }
        } catch (NotEncodableValueException $e) {
            return $this->json($e->getMessage(), 400);
        }
    }
}