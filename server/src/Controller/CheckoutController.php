<?php

namespace App\Controller;

use App\Entity\Region;
use App\Repository\RegionRepository;
use App\Repository\ShippingPricingRepository;
use App\Repository\SubproductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class CheckoutController extends AbstractController
{
    /**
     * @Route("/api/checkout", name="checkout")
     */
    public function index()
    {
        return $this->render('checkout/index.html.twig', [
            'controller_name' => 'CheckoutController',
        ]);
    }

    /**
     * @Route("/api/checkout/shipping", name="checkout_shipping", methods="POST")
     */
    public function checkoutShipping(Request $request, SubproductRepository $subproductRepository)
    {
        $jsonContent = $request->getContent();
        $req = json_decode($jsonContent);

        if (!isset($req->region_id)) return $this->json(['message' => 'region_id missing'], 400, []);
        $region = $this->getDoctrine()->getRepository(Region::class)->find($req->region_id);
        if (!isset($region)) return $this->json(['message' => 'region not found'], 400, []);

        if (!isset($req->subproducts)) return $this->json(['message' => 'subproducts missing'], 400, []);

        $shippingPricings = $region->getShippingPricings();;
        $shippingMethods = [];
        $lowestPrice = 0;
        $lowestKey = false;
        foreach ($shippingPricings as $key => $val) {
            $method['id'] = $val->getShippingMethod()->getId();
            $method['name'] = $val->getShippingMethod()->getName();
            $method['duration'] = $val->getDuration();

            foreach ($req->subproducts as $value) {
                $product = $subproductRepository->find($value->subproduct_id);
                $price = $product->getWeight() * $val->getPricePerKilo();
                $price *= $value->quantity;
            }
            $method['price'] = $price + $val->getBasePrice();

            if ($key == 0) {
                $lowestPrice = $method['price'];
                $lowestKey = $key;
            } else if ($lowestPrice > $method['price']) {
                $lowestPrice = $method['price'];
                $lowestKey = $key;
            }
            $shippingMethods[] = $method;
        }
        return $this->json(["lowestPriceKey" => $lowestKey, "shippingMethods" => $shippingMethods], 200);
    }

    // this route sendback payment methods depending on region restrictions
    /**
     * @Route("/api/checkout/payment", name="checkout_payment")
     */
    public function checkoutPayment()
    {
        return $this->render('checkout/index.html.twig', [
            'controller_name' => 'CheckoutController',
        ]);
    }
}
