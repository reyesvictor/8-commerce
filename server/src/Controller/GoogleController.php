<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class GoogleController extends AbstractController
{
    /**
     * @Route("/connect/google/check", name="connect_google_check")
     */
    public function connectCheckAction(Request $request, JWTTokenManagerInterface $JWTManager)
    {
        $user = $this->getUser();

        return new JsonResponse(['token' => $JWTManager->create($user), 'user' => ['method_login' => 'google', 'role' => $user->getRoles(), 'email' => $user->getEmail(), 'id' => $user->getId()]]);
    }
}
