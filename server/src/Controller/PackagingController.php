<?php

namespace App\Controller;

use App\Entity\Packaging;
use App\Repository\PackagingRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class PackagingController extends AbstractController
{
    /**
     * @Route("/api/packaging", name="packaging_index", methods="GET")
     */
    public function packagingIndex(PackagingRepository $packagingRepository)
    {
        $packaging = $packagingRepository->findAll();
        return $this->json($packaging, 200);
    }

    /**
     * @Route("/api/packaging/available", name="packaging_available", methods="GET")
     */
    public function packagingAvailable(Request $request, PackagingRepository $packagingRepository)
    {
        $spending = $request->query->get('spending');
        $packaging = $packagingRepository->findByAvailable(new DateTime(), $spending);

        return $this->json($packaging, 200);
    }

    /**
     * @Route("/api/packaging/{id}", name="packaging_details", methods="GET", requirements={"id":"\d+"})
     */
    public function packagingDetails(Request $request, PackagingRepository $packagingRepository)
    {
        $packaging = $packagingRepository->find($request->attributes->get('id'));
        if (!$packaging) return $this->json(["message" => "packaging not found"], 404);
        return $this->json($packaging, 200);
    }

    /**
     * @Route("/api/packaging", name="packaging_create", methods="POST")
     */
    public function packagingCreate(Request $request, SerializerInterface $serializer, ValidatorInterface $validator, EntityManagerInterface $em)
    {
        try {
            $jsonContent = $request->getContent();
            try {
                $packaging = $serializer->deserialize($jsonContent, Packaging::class, 'json');
            } catch (NotNormalizableValueException $e) {
                return $this->json(['message' => $e->getPrevious()->getMessage()], 400);
            }

            $error = $validator->validate($packaging);
            if (count($error) > 0) return $this->json($error, 400);

            $em->persist($packaging);
            $em->flush();

            return $this->json(["message" => "created", "packaging" => $packaging], 201);
        } catch (NotEncodableValueException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * @Route("/api/packaging/{id}", name="packaging_update", methods="PUT")
     */
    public function packagingUpdate(Request $request, SerializerInterface $serializer, PackagingRepository $packagingRepository, EntityManagerInterface $em)
    {
        try {
            $jsonContent = $request->getContent();
            $packaging = $packagingRepository->find($request->attributes->get('id'));
            if (!$packaging) return $this->json(["message" => "not found"], 404);

            try {
                $packaging = $serializer->deserialize($jsonContent, Packaging::class, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $packaging]);
            } catch (NotEncodableValueException $e) {
                return $this->json(['message' => $e->getMessage()], 400, []);
            }

            $em->persist($packaging);
            $em->flush();

            return $this->json(["message" => "updated", "packaging" => $packaging], 200);
        } catch (NotEncodableValueException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * @Route("/api/packaging/{id}", name="packaging_delete", methods="DELETE")
     */
    public function packagingDelete(Request $request, SerializerInterface $serializer, PackagingRepository $packagingRepository, EntityManagerInterface $em)
    {
        $packaging = $packagingRepository->find($request->attributes->get('id'));

        if (!$packaging) return $this->json(["message" => "not found"], 404);

        $em->remove($packaging);
        $em->flush();

        return $this->json(["message" => "deleted.", "packaging" => $packaging], 200);
    }
}
