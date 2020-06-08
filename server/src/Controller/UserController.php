<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use App\Entity\Supplier;
use App\Entity\SupplierOrder;
use App\Repository\SupplierRepository;
use App\Repository\SupplierOrderRepository;
use App\Repository\SubproductRepository;
use App\Repository\UserRepository;
use DateInterval;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpFoundation\Cookie;
use ReallySimpleJWT\Token;

//Salut Victor
// require '../../vendor/autoload.php';

class UserController extends AbstractController
{
    /**
     * @Route("/supplier", name="supplier", methods="GET")
     */
    public function addSupplier(EntityManagerInterface $em)
    {
     $supplier = new Supplier();
     $supplier->setName('haolebg');
     $em->persist($supplier);
     $em->flush();

     return new Response('hao est bien un bg');

    }
    /**
     * @Route("/prout", name="prout", methods="GET")
     */
    public function addSupplierOrder(EntityManagerInterface $em,SupplierRepository $supplierOrder)
    {

        $supplier = $supplierOrder->findOneBy(['id' => 1]);
        
 
        $supplierOrder = new SupplierOrder();
        $supplierOrder->setSupplier($supplier);
        $supplierOrder->setOurAddress('4 rue de hao le bg');
        $supplierOrder->setStatus(true);
        $supplierOrder->setPrice(69);
        $date = new DateTime();
        $supplierOrder->setArrivalDate($date);
        $supplierOrder->setCreatedAt(new DateTime());
      
        $em->persist($supplierOrder);
        $em->flush();

        return new Response('hao est bien un bg');

    }

    /**
     * @Route("/prout2", name="prout2", methods="GET")
     */
    public function addSupplierProduct(EntityManagerInterface $em,SupplierOrderRepository $supplierrepo, SubProductRepository $subrepo)
    {
        $subproduct = $subrepo->findOneBy(['id' => 1]);
        $supplierOrder = $supplierrepo->findOneBy(['id' => 1]);
        $supplierOrder->addSubproduct($subproduct);

        $em->persist($supplierOrder);
        $em->flush();


        return new Response('hao est bien un bg');

    }



    /**
     * @Route("/user", name="user")
     */
    public function index()
    {
        return $this->render('user/index.html.twig', [
            'controller_name' => 'UserController',
        ]);
    }

    /**
     * @Route("/register", name="register")
     */
    public function register(Request $request, UserRepository $userRepository, UserPasswordEncoderInterface $passwordEncoder)
    {
        // return new JsonResponse([...$request], 400);

        // gets the json data
        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }
        // checks if email and password are correctly input
        if (!isset($data['email']) || !isset($data['password'])) {
            // sends error if email or password are missing
            return new JsonResponse(['msg' => 'Email or password are missing'], 400);
        } else {
            // checks if the email is already taken
            if ($userRepository->findBy(['email' => $data['email']])) {
                // sends error if the email is already in use
                return new JsonResponse(['msg' => 'Email already in use'], 401);
            } else {
                // register the user
                $user = new User();
                $user->setEmail($data['email']);
                $user->setCreatedAt(new DateTime());
                $user->setRoles(['user']);
                // $encoded = $passwordEncoder->encodePassword($user, $data['password']);
                $user->setPassword(password_hash($data['password'], PASSWORD_ARGON2I));
                $entityManager = $this->getDoctrine()->getManager();
                $entityManager->persist($user);
                $entityManager->flush();

                $token = $this->createToken($user);
                $userInRes = ['id' => $user->getId(), 'email' => $user->getEmail(), 'role' => $user->getRoles()[0]];
                return new JsonResponse(['user' => $userInRes, 'token' => $token], 200);
            }

            // return new JsonResponse(['msg' => "Incorrect email or password"], 400);
        }
    }

    /**
     * @Route("/login", name="login")
     */
    public function login(Request $request, UserRepository $userRepository, UserPasswordEncoderInterface $passwordEncoder)
    {
        // return new JsonResponse(['msg' => 'Incorrect email or password'], 400);
        // gets the json data
        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }
        // checks if email and password are correctly input
        if (!isset($data['email']) || !isset($data['password'])) {
            // sends error if email or password are missing
            return new JsonResponse(['msg' => 'Email or password are missing'], 400);
        } else {
            if (!$userRepository->findBy(['email' => $data['email']])) {
                return new JsonResponse(['msg' => 'Incorrect email or password'], 400);
            } else {
                $user = $userRepository->findBy(['email' => $data['email']])[0];
                if (password_verify($data['password'], $user->getPassword())) {
                    $token = $this->createToken($user);
                    $userInRes = ['id' => $user->getId(), 'email' => $user->getEmail(), 'role' => $user->getRoles()[0]];
                    return new JsonResponse(['user' => $userInRes, 'token' => $token], 200);
                } else {
                    return new JsonResponse(['msg' => "Incorrect email or password"], 400);
                }
            }
        }
    }

    /**
     * @Route("/checktoken", name="checktoken")
     */
    public function checkToken(Request $request, UserRepository $userRepository, UserPasswordEncoderInterface $passwordEncoder)
    {
        if ($request->headers->get('x-auth-token')) {

            $data = $request->headers->get('x-auth-token');
            // $request->request->replace(is_array($data) ? $data : array());

            if (Token::validate($data, $_ENV["APP_SECRET"])) {

                $dataInToken = Token::getPayload($data, $_ENV["APP_SECRET"]);
                if (!$userRepository->findBy(['id' => $dataInToken['user_id']['user']])) {
                    return new JsonResponse(['msg' => 'Bad token'], 400);
                } else {
                    $user = $userRepository->findBy(['id' => $dataInToken['user_id']['user']])[0];
                    return new JsonResponse(['id' => $user->getId(), 'email' => $user->getEmail(), 'role' => $user->getRoles()[0]], 200);
                }
            }
            return new JsonResponse(['msg' => "the Bad token"], 400);
        }
    }

    private function createToken($user)
    {
        $userId = ['user' => $user->getId(), 'role' => $user->getRoles()[0]];
        $secret = $_ENV["APP_SECRET"];
        $expiration = time() + 3600 * 24;
        $issuer = '8-commerce';

        return Token::create($userId, $secret, $expiration, $issuer);
    }
}
