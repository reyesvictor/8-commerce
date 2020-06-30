<?php

namespace App\Controller;

use DateTime;
use App\Entity\PromoCode;
use App\Repository\PromoCodeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class PromoCodeController extends AbstractController
{
    /**
     * @Route("/api/promocode", name="get_promocodes", methods="GET")
     */
    public function index(Request $request, PromoCodeRepository $promoCodeRepository)
    {
        $count = $promoCodeRepository->countTotalResults();
        $promoCode = $promoCodeRepository->findBy([], null, $request->query->get('limit'), $request->query->get('offset'));
        return $this->json(['nbResults' => $count, 'data' => $promoCode], 200, []);
    }

    /**
     * @Route("/api/promocode/create", name="create_promocodes", methods="POST")
     */
    public function promocode_create(Request $request, PromoCodeRepository $promoCodeRepository, EntityManagerInterface $em)
    {

        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $req = json_decode($request->getContent());
        $find = $promoCodeRepository->findOneBy(['code' => $req->code]);

        if ($find) {
            return $this->json(['message' => 'This promo code already exist'], 400, []);
        } else {
            $PromoCode  = new PromoCode();
            $PromoCode->setCode(strtoupper($req->code));
            $PromoCode->setPercentage($req->percentage);
            if ($req->dateEnd) {
                $timestamp = intval($req->dateEnd) + 7200;
                $dateend = new DateTime("@$timestamp");
                $PromoCode->setDateEnd($dateend);
            }
            $PromoCode->setUsedTimes(0);
            if ($req->usedLimit) $PromoCode->setUsedLimit($req->usedLimit);
            $em->persist($PromoCode);
            $em->flush();
            return $this->json(['message' => 'PromoCode successfully created', 'promocode' => $PromoCode], 200);
        }
    }

    /**
     * @Route("/api/promocode/{id}", name="promocode_remove", methods="DELETE", requirements={"id":"\d+"})
     */
    public function promocode_remove(Request $request, PromoCodeRepository $promoCodeRepository, EntityManagerInterface $em)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $PromoCode = $promoCodeRepository->findOneBy(['id' => $request->attributes->get('id')]);

        if ($PromoCode) {
            $em->remove($PromoCode);
            $em->flush();

            return $this->json([
                'message' => 'Promo Code removed',
                'promocode' => $PromoCode
            ], 200);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/promocode/{id}", name="promocode_update", methods="PUT",requirements={"id":"\d+"})
     */
    public function promocode_update(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, PromoCodeRepository $promoCodeRepository)
    {
        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            $promocode = $promoCodeRepository->findOneBy(['id' => $request->attributes->get('id')]);

            if ($promocode) {

                if (isset($req->code)) {
                    $nameExists = $promoCodeRepository->findOneBy(['code' => $req->code]);
                    if ($nameExists) {
                        if ($nameExists->getId() != $promocode->getId()) return $this->json(['message' => 'Promo Code name already taken'], 404);
                    }

                    $promocode->setCode($req->code);
                }

                if (isset($req->percentage)) {
                    $promocode->setPercentage($req->percentage);
                }

                if ($req->dateEnd) {
                    $timestamp = intval($req->dateEnd) + 7200;
                    $dateend = new DateTime("@$timestamp");
                    $promocode->setDateEnd($dateend);
                } else {
                    $promocode->setDateEnd(null);
                }

                if (isset($req->usedTimes)) {
                    $promocode->setUsedTimes($req->usedTimes);
                }

                if ($req->usedLimit) $promocode->setUsedLimit($req->usedLimit);
                else $promocode->setUsedLimit(null);

                $error = $validator->validate($promocode);

                if (count($error) > 0) return $this->json($error, 400);
                $em->persist($promocode);
                $em->flush();

                return $this->json($promocode, 200);
            } else {
                return $this->json(['message' => 'Promo Code not found'], 404, []);
            }
        } catch (NotEncodableValueException $e) {
            return $this->json($e->getMessage(), 400);
        }
    }

    /**
     * @Route("/api/promocode", name="check_promocodes", methods="POST")
     */
    public function checkPromoCode(Request $request)
    {
        try {
            $jsonContent = $request->getContent();
            $data = json_decode($jsonContent);

            if (!isset($data->promocode)) return $this->json(['message' => 'The promo code is missing.'], 400);

            $promoCode = $this->getDoctrine()->getRepository(PromoCode::class)->findOneBy(['code' => $data->promocode]);
            if (!$promoCode) return $this->json(['message' => "Promo Code does not exist."], 404);
            if ($promoCode->getDateEnd() < new DateTime() && !$promoCode->getUsedLimit()) return $this->json(['message' => 'Promo Code has expired.'], 404);
            if ($promoCode->getUsedLimit()) {
                if ($promoCode->getUsedLimit() <= $promoCode->getUsedTimes()) return $this->json(['message' => 'Promo Code has been used to its limit.'], 404);
                if ($promoCode->getDateEnd() < new DateTime() && $promoCode->getDateEnd()) return $this->json(['message' => 'Promo Code has expired.'], 404);
            }

            return $this->json([
                'id' => $promoCode->getId(),
                'code' => $promoCode->getCode(),
                "percentage" => $promoCode->getPercentage()
            ], 200);
        } catch (NotEncodableValueException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }
    }
}
