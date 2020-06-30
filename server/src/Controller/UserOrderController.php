<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use App\Entity\UserOrder;
use App\Repository\UserRepository;
use App\Repository\UserOrderRepository;
use App\Repository\AddressBillingRepository;
use App\Repository\AddressShippingRepository;
use DateTime;
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

class UserOrderController extends AbstractController
{
    /**
     * @Route("/api/userorder", name="userorder_index", methods="GET")
     */
    public function index(UserOrderRepository $userOrderRepository)
    {
        $userOrders = $userOrderRepository->findAll();
        return $this->json($userOrders, 200, [], ['groups' => 'user_address']);
    }

    /**
     * @Route("/api/userorder", name="userorder_create", methods="POST")
     */
    public function userOrder_create(ValidatorInterface $validator, Request $request, SerializerInterface $serializer, AddressBillingRepository $addressBillingRepository, UserRepository $userRepository, AddressShippingRepository $addressShippingRepository, EntityManagerInterface $em)
    {
        $jsonContent = $request->getContent();
        $req = json_decode($jsonContent);

        $userOrder = $serializer->deserialize($jsonContent, UserOrder::class, 'json', [
            AbstractNormalizer::IGNORED_ATTRIBUTES => ['addressShipping', 'addressBilling', 'createdAt', 'packaging', 'user'],
            ObjectNormalizer::DISABLE_TYPE_ENFORCEMENT => true
        ]);


        if (!isset($req->addressBilling)) {
            return $this->json(['message' => 'Address billing is undefined'], 400);
        }
        if (!isset($req->addressShipping)) {
            return $this->json(['message' => 'Address shipping is undefined'], 400);
        }
        // if(!isset($req->packaging)){
        //     return $this->json(['message' => 'Packaging is undefined'],400);
        // }


        $addressBilling = $addressBillingRepository->findOneBy(['id' => $req->addressBilling]);
        if (!$addressBilling) {
            return $this->json(['message' => 'Address billing not found'], 404);
        }

        $addressShipping = $addressShippingRepository->findOneBy(['id' => $req->addressShipping]);
        if (!$addressShipping) {
            return $this->json(['message' => 'Address shipping not found'], 404);
        }

        if (isset($req->user)) {
            $user = $userRepository->findOneBy(['id' => $req->user]);
            if (!$user) {
                return $this->json(['message' => 'User not found'], 404);
            }
            $userOrder->setUser($user);
        }

        $error = $validator->validate($userOrder);
        if (count($error) > 0) return $this->json($error, 400);

        // $userOrder->setPackaging($req->packaging);
        $userOrder->setAddressBilling($addressBilling);
        $userOrder->setAddressShipping($addressShipping);
        $userOrder->setCreatedAt(new DateTime());

        $em->persist($userOrder);
        $em->flush();
        return $this->json(['message' => 'User order successfully created', 'userOrder' => $userOrder], 200, [], ['groups' => 'user_address']);
    }

    /**
     * @Route("/api/userorder/{id}", name="userorder_remove", methods="DELETE", requirements={"id":"\d+"})
     */
    public function userOrderRemove(Request $request, UserOrderRepository $userOrderRepository, EntityManagerInterface $em)
    {
        $userOrder = $userOrderRepository->findOneBy(['id' => $request->attributes->get('id')]);

        if ($userOrder) {
            $em->remove($userOrder);
            $em->flush();

            return $this->json([
                'message' => 'User order removed',
                'userOrder' => $userOrder
            ], 200, [], ['groups' => 'user_address']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/userorder/{id}", name="userorder_details", methods="GET", requirements={"id":"\d+"})
     */
    public function userOrderDetails(Request $request, UserOrderRepository $userOrderRepository)
    {
        $userOrder = $userOrderRepository->findOneBy(['id' => $request->attributes->get('id')]);
        if ($userOrder) {
            return $this->json($userOrder, 200, [], ['groups' => 'user_address']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/userorder/count", name="count_registered", methods="GET")
     */
    public function countIfRegisteredOrder(Request $request, UserOrderRepository $userOrderRepository)
    {
        $count1 = $userOrderRepository->countRegisteredBuyersResults();
        $count2 = $userOrderRepository->countUnregisteredBuyersResults();
        $totalOrdersCount = $userOrderRepository->countAllOrders();
        $totalOrdersPrice = round($userOrderRepository->countTotalPrice(), 2);
        $totalProductsSold = $userOrderRepository->countTotalProductsSold();

        $avgProductsPerOrder = round(($totalProductsSold / $totalOrdersCount), 2);
        $avgPricePerOrder = round(($totalOrdersPrice / $totalOrdersCount), 2);

        $ordersPerRegion = $userOrderRepository->countOrdersPerRegion();

        return $this->json([
            'unique_registered_buyers' => $count1,
            'unregistered_buyers' => $count2['unregistered_buyers'],
            'total_orders_count' => $totalOrdersCount,
            'total_orders_price' => $totalOrdersPrice,
            'total_products_sold' => $totalProductsSold,
            'average_products_per_order' => $avgProductsPerOrder,
            'average_price_per_order' => $avgPricePerOrder,
            'ordres_per_region' => $ordersPerRegion
        ], 200);
    }

    /**
     * @Route("/api/userorder/{id}", name="userorder_update", methods="PUT",requirements={"id":"\d+"})
     */
    public function userOrderUpdate(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, SerializerInterface $serializer, UserOrderRepository $userOrderRepository, AddressBillingRepository $addressBillingRepository, AddressShippingRepository $addressShippingRepository, UserRepository $userRepository)
    {
        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            $userOrder = $userOrderRepository->findOneBy(['id' => $request->attributes->get('id')]);

            if ($userOrder) {
                try {
                    $userOrder = $serializer->deserialize($jsonContent, userOrder::class, 'json', [
                        AbstractNormalizer::IGNORED_ATTRIBUTES => ['addressBilling', 'addressShipping', 'packaging'],
                        AbstractNormalizer::OBJECT_TO_POPULATE => $userOrder
                    ]);
                } catch (NotNormalizableValueException $e) {
                    return $this->json(['message' => $e->getMessage()], 400, []);
                }

                if (isset($req->packaging)) {
                    $userOrder->setPackaging($req->packaging);
                }

                if (isset($req->addressShipping)) {
                    $addressShipping = $addressShippingRepository->findOneBy(['id' => $req->addressShipping]);
                    if (!$addressShipping) {
                        return $this->json(['message' => 'Address shipping not found'], 404);
                    }
                    $userOrder->setAddressShipping($addressShipping);
                }

                if (isset($req->addressBilling)) {
                    $addressBilling = $addressBillingRepository->findOneBy(['id' => $req->addressBilling]);
                    if (!$addressBilling) {
                        return $this->json(['message' => 'Address billing not found'], 404);
                    }
                    $userOrder->setAddressBilling($addressBilling);
                }

                if (isset($req->user)) {
                    $user = $userRepository->findOneBy(['id' => $req->user]);
                    if (!$user) {
                        return $this->json(['message' => 'User not found'], 404);
                    }
                    $userOrder->setUser($user);
                }

                $error = $validator->validate($userOrder);
                if (count($error) > 0) return $this->json($error, 400);
                $em->persist($userOrder);
                $em->flush();

                return $this->json($userOrder, 200, [], ['groups' => 'user_address']);
            } else {
                return $this->json(['message' => 'User order not found'], 404, []);
            }
        } catch (NotEncodableValueException $e) {
            return $this->json($e->getMessage(), 400);
        }
    }
}
