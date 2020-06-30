<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Review;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Repository\ReviewRepository;
use App\Repository\ProductRepository;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ReviewController extends AbstractController
{
    /**
     * @Route("/api/review", name="review_index", methods="GET")
     */
    public function index(Request $request, ReviewRepository $reviewRepository)
    {   
        $count = $reviewRepository->countTotalResults();
        $reviews = $reviewRepository->findBy([], null, $request->query->get('limit'), $request->query->get('offset'));
        if(!$reviews){
            return $this->json(['message' => 'No review found'], 404);
        }
        return $this->json(['nbResults' => $count, 'data' => $reviews], 200, [],['groups' => 'review']);
    }

    /**
     * @Route("/api/review/unverified", name="unverified_review_index", methods="GET")
     */
    public function unverifiedReview(Request $request, ReviewRepository $reviewRepository)
    {
        $count = $reviewRepository->countTotalUnverifiedResults();
        $reviews = $reviewRepository->findBy(['verified' => 0], null, $request->query->get('limit'), $request->query->get('offset'));
        if(!$reviews){
            return $this->json(['message' => 'No review found'], 404);
        }
        return $this->json(['nbResults' => $count, 'data' => $reviews], 200, [],['groups' => 'review']);
    }

    /**
     * @Route("/api/review/product/{id}", name="productreview_index", methods="GET", requirements={"id":"\d+"})
     */
    public function productReview(ReviewRepository $reviewRepository, Request $request)
    {
        $reviews = $reviewRepository->findBy(['product' => $request->attributes->get('id'),'review' => null]);
        if(!$reviews){
            return $this->json(['message' => 'No review for this product'], 404);
        }
 
        return $this->json($reviews, 200, [],['groups' => 'review']);
    }

    /**
     * @Route("/api/review", name="review_create", methods="POST")
     */
    public function reviewCreate(ValidatorInterface $validator,SerializerInterface $serializer,Request $request ,ReviewRepository $reviewRepository,ProductRepository $productRepository,UserRepository $userRepository,EntityManagerInterface $em)
    { 
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $jsonContent = $request->getContent();
        $req = json_decode($jsonContent);

        try{
            $review = $serializer->deserialize($jsonContent, Review::class, 'json', [
                AbstractNormalizer::IGNORED_ATTRIBUTES => ['user', 'product','review'],
                ObjectNormalizer::DISABLE_TYPE_ENFORCEMENT => true
            ]);
        } catch (NotNormalizableValueException $e) {
            return $this->json(['message' => $e->getPrevious()->getMessage()], 400);
        }
   
        if(isset($req->review)){
            $findreview = $reviewRepository->findOneBy(['id' => $req->review]);
            if(!$findreview){
                return $this->json(['message' => 'Review not found'],404);
            }
            $review->setReview($findreview);
        }

        $user = $this->getUser();

        if (!isset($req->product)) return $this->json(['message' => 'Product missing'], 400, []);
        $product = $productRepository->findOneBy(['id' => $req->product]);
        if(!$product){
            return $this->json(['message' => 'Product not found'],404);
        }
       
        if($userRepository->findUserProductById($user->getId(), $product->getId())) {
            $review->setVerified(true);
        } else $review->setVerified(false);

        $error = $validator->validate($review);
        if (count($error) > 0) return $this->json($error, 400);
        $review->setCreatedAt(new DateTime());
        $review->setUser($user);
        $review->setProduct($product);
        $em->persist($review);
        $em->flush();

        return $this->json(['message'=>'review successfully created'], 200,[]);
    }

    /**
     * @Route("/api/review/{id}", name="review_remove", methods="DELETE", requirements={"id":"\d+"})
     */
    public function reviewRemove(Request $request, ReviewRepository $reviewRepository, EntityManagerInterface $em)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $review= $reviewRepository->findOneBy(['id' => $request->attributes->get('id')]);

        if ($review) {
            $em->remove($review);
            $em->flush();

            return $this->json([
                'message' => 'review removed',
                'review' => $review
            ], 200, [], ['groups' => 'review']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/review/{id}", name="review_details",methods="GET", requirements={"id":"\d+"})
     */
    public function reviewDetails(Request $request, ReviewRepository $reviewRepository)
    {
        $review = $reviewRepository->find($request->attributes->get('id'));

        if ($review) {
            return $this->json($review, 200, [], ['groups' => 'review']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }
    

    /**
     * @Route("/api/review/{id}", name="review_update", methods="PUT",requirements={"id":"\d+"})
     */
    public function reviewUpdate(SerializerInterface $serializer,Request $request, EntityManagerInterface $em, ValidatorInterface $validator, UserRepository $userRepository,ReviewRepository $reviewRepository,ProductRepository $productRepository)
    {
        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            $review = $reviewRepository->findOneBy(['id' => $request->attributes->get('id')]);
           
            if ($review) {

                try {
                    $review = $serializer->deserialize($jsonContent, Review::class, 'json', [
                        AbstractNormalizer::IGNORED_ATTRIBUTES => ['product', 'user','review'],
                        AbstractNormalizer::OBJECT_TO_POPULATE => $review
                    ]);
                } catch (NotNormalizableValueException $e) {
                    return $this->json(['message' => $e->getMessage()], 400, []);
                }   
                
                if (isset($req->user)) {
                    $user = $userRepository->findOneBy(['id' => $req->user]);
                    if(!$user){
                        return $this->json(['message' => 'User not found'],404);
                    }
                    $review->setUser($user);
                }

                if (isset($req->product)) {
                    $product = $productRepository->findOneBy(['id' => $req->product]);
                    if(!$product){
                        return $this->json(['message' => 'Product not found'],404);
                    }
                    $review->setProduct($product);
                }

                if (isset($req->review)) {
                    $findReview = $reviewRepository->findOneBy(['id' => $req->review]);
                    if(!$findReview){
                        return $this->json(['message' => 'Review not found'],404);
                    }
                    $review->setReview($findReview);
                }

                $error = $validator->validate($review);
                if (count($error) > 0) return $this->json($error, 400);
                $em->persist($review);
                $em->flush();

                return $this->json(['message' => 'Review successfully updated','review' => $review], 200, [], ['groups' => 'review']);
            } else {
                return $this->json(['message' => 'Review not found'], 404, []);
            }
        } catch (NotEncodableValueException $e) {
            return $this->json($e->getMessage(), 400);
        }
    }
}