<?php
namespace App\Controller;

use DateTime;
use App\Kernel;
use App\Entity\Product;
use App\Entity\Category;
use App\Entity\CardCredentials;
use App\Entity\SubCategory;
use App\Entity\Supplier;
use App\Repository\UserRepository;
use App\Repository\ImageRepository;
use App\Repository\ProductRepository;
use App\Repository\SubproductRepository;
use App\Repository\CardCredentialsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;

class CardCredentialsController extends AbstractController
{
    /**
     * @Route("/api/cardcredentials", name="cardcredentials_index", methods="GET")
     */
    public function index(CardCredentialsRepository $cardCredentialsRepository)
    {
        $cardCredentials = $cardCredentialsRepository->findAll();

        if(!$cardCredentials){
            return $this->json(['mesage' => 'No card credentials found'], 404);
        }
        
        return $this->json($cardCredentials, 200, [], ['groups' => 'user']);
    }

    /**
     * @Route("/api/cardcredentials/user/{id}", name="cardcredentialsbyuser_details", methods="GET", requirements={"id":"\d+"})
     */
    public function cardCredentialsByUser(Request $request, CardCredentialsRepository $cardCredentialsRepository)
    {
        $cardCredentials = $cardCredentialsRepository->findBy(['user' => $request->attributes->get('id')]);
        if ($cardCredentials) {
            return $this->json($cardCredentials, 200, [], ['groups' => 'user']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/cardcredentials/{id}", name="cardcredentials_details", methods="GET", requirements={"id":"\d+"})
     */
    public function cardCredentialsDetails(Request $request, CardCredentialsRepository $cardCredentialsRepository)
    {
        $cardCredentials = $cardCredentialsRepository->findOneBy(['id' => $request->attributes->get('id')]);
        if ($cardCredentials) {
            return $this->json($cardCredentials, 200, [], ['groups' => 'user']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/cardcredentials/{id}", name="cardcredentials_remove", methods="DELETE", requirements={"id":"\d+"})
     */
    public function cardCredentialsRemove(Request $request, EntityManagerInterface $em,CardCredentialsRepository $cardCredentialsRepository)
    {
        $id = $request->attributes->get('id');
        $cardCredentials = $cardCredentialsRepository->findOneBy(['id' => $id ]);
        if ($cardCredentials) {
            $em->remove($cardCredentials);
            $em->flush();

            return $this->json(['message' => 'Card credentials successfully removed'], 200, []);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/cardcredentials", name="cardcredentials_create", methods="POST")
     */
    public function cardCrendtialsCreate(Request $request, UserRepository $userRepository,SerializerInterface $serializer,EntityManagerInterface $em,ValidatorInterface $validator)
    {
        $jsonContent = $request->getContent();
        $req = json_decode($jsonContent);

        $cardCredentials = $serializer->deserialize($jsonContent, CardCredentials::class, 'json', [
            AbstractNormalizer::IGNORED_ATTRIBUTES => ['user'],
            ObjectNormalizer::DISABLE_TYPE_ENFORCEMENT => true
        ]);
          
        if(!isset($req->user)){
            return $this->json(['message' => 'User is missing'], 400);
        }
        $user = $userRepository->findOneBy(['id' => $req->user]);
        if(!$user){
            return $this->json(['message' => 'User not found'], 404);
        }

        $cardCredentials->setUser($user);

        $error = $validator->validate($cardCredentials);
        if (count($error) > 0) return $this->json($error, 400);

        $em->persist($cardCredentials);
        $em->flush();
        
        return $this->json(['message' => 'Card credentials successfully created', 'cardCredentials' => $cardCredentials], 200, [],['groups' => 'user']);
    }

    /**
     * @Route("/api/cardcredentials/{id}", name="cardcredentials_update", methods="PUT",requirements={"id":"\d+"})
     */
    public function cardCredentialsUpdate(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, CardCredentialsRepository $cardCredentialsRepository, UserRepository $userRepository)
    {
        $jsonContent = $request->getContent();
        $req = json_decode($jsonContent);
        $cardCredentials = $cardCredentialsRepository->findOneBy(['id' => $request->attributes->get('id')]);
        
        if ($cardCredentials) {

            if (isset($req->user)) {
                $user = $userRepository->findOneBy(['id' => $req->user]);
                if(!$user){
                    return $this->json(['message' => 'User not found'], 404, []);
                }
                $cardCredentials->setUser($user);
            }

            if (isset($req->cardNumbers)) {
                $cardCredentials->setCardNumbers($req->cardNumbers);
            }

            if (isset($req->expirationDate)) {
                $cardCredentials->setExpirationDate($req->expirationDate);
            }

            if(isset($req->ccv)){
                $cardCredentials->setCcv($req->ccv);
            }

            if(isset($req->firstname)){
                $cardCredentials->setFirstname($req->firstname);
            }

            if(isset($req->lastname)){
                $cardCredentials->setLastname($req->lastname);
            }

            $em->persist($cardCredentials);
            $em->flush();

            return $this->json($cardCredentials, 200, [], ['groups' => 'user']);
        } else {
            return $this->json(['message' => 'Card credentials not found'], 404, []);
        }
    }

}