<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use App\Repository\UserRepository;
use DateTime;
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

    /**
     * @Route("/api/user/{id}/address", name="user_address", methods="GET")
     */
    public function userAddress(Request $request, UserRepository $userRepository)
    {
        $user = $userRepository->find($request->attributes->get('id'));
        return $this->json($user, 200, [], ['groups' => 'user_address']);
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
