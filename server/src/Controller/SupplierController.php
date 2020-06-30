<?php

namespace App\Controller;

use App\Entity\Supplier;
use App\Repository\SupplierRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class SupplierController extends AbstractController
{
    /**
     * @Route("/api/supplier", name="supplier_index", methods="GET")
     */
    public function index(Request $request, NormalizerInterface $normalizer, SupplierRepository $supplierRepository)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $count = $supplierRepository->countAllResults();
        $supplierOrders = $supplierRepository->findBy([], null, $request->query->get('limit'), $request->query->get('offset'));
        $supplierOrders = $normalizer->normalize($supplierOrders, null, ['groups' => 'supplier']);

        return $this->json(['nbResults' => $count, 'data' => $supplierOrders], 200, [], ['groups' => 'supplier']);
    }

    /**
     * @Route("/api/supplier/{id}", name="supplier_details",methods="GET", requirements={"id":"\d+"})
     */
    public function supplierDetails(Request $request, SupplierRepository $supplierRepository)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $supplier = $supplierRepository->findOneBy(['id' => $request->attributes->get('id')]);
        if ($supplier) {
            return $this->json($supplier, 200, [], ['groups' => 'supplier_details']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/supplier/{id}/products", name="supplier_products",methods="GET", requirements={"id":"\d+"})
     */
    public function supplierProducts(Request $request, SupplierRepository $supplierRepository)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $supplier = $supplierRepository->findOneBy(['id' => $request->attributes->get('id')]);
        if ($supplier) {
            return $this->json($supplier, 200, [], ['groups' => 'supplier_products']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/supplier", name="supplier_create", methods="POST")
     */
    public function supplierCreate(Request $request, EntityManagerInterface $em, SerializerInterface $serializer, ValidatorInterface $validator)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $jsonContent = $request->getContent();
        try {
            $supplier = $serializer->deserialize($jsonContent, Supplier::class, 'json', [AbstractNormalizer::IGNORED_ATTRIBUTES => ['supplierOrders']]);
        } catch (NotNormalizableValueException $e) {
            return $this->json(['message' => $e->getPrevious()->getMessage()], 400);
        }

        $error = $validator->validate($supplier);
        if (count($error) > 0) return $this->json($error, 400);

        $em->persist($supplier);
        $em->flush();

        return $this->json(['messgae' => 'created', 'supplier' => $supplier], 201, [], ['groups' => 'supplier']);
    }

    /**
     * @Route("/api/supplier/{id}", name="supplier_update", methods="PUT", requirements={"id":"\d+"})
     */
    public function supplierUpdate(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, SerializerInterface $serializer, SupplierRepository $supplierRepository)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        try {
            $supplier = $supplierRepository->findOneBy(['id' => $request->attributes->get('id')]);;
            if ($supplier) {
                try {
                    $jsonContent = $request->getContent();
                    $data = json_decode($jsonContent);
                    $supplier = $serializer->deserialize($jsonContent, Supplier::class, 'json', [
                        AbstractNormalizer::IGNORED_ATTRIBUTES => ['supplierOrders'],
                        AbstractNormalizer::OBJECT_TO_POPULATE => $supplier
                    ]);
                } catch (NotNormalizableValueException $e) {
                    return $this->json(['message' => $e->getMessage()], 400, []);
                }

                if (!isset($data->name)) return $this->json(['message' => 'name is missing'], 400, []);

                $error = $validator->validate($supplier);
                if (count($error) > 0) return $this->json($error, 400);

                $em->persist($supplier);
                $em->flush();

                return $this->json(['supplier' => $supplier], 200, [], ['groups' => 'supplier', AbstractNormalizer::IGNORED_ATTRIBUTES => ['supplierOrders']]);
            } else {
                return $this->json(['message' => 'supplier not found'], 404, []);
            }
        } catch (NotEncodableValueException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * @Route("/api/supplier/{id}", name="supplier_remove", methods="DELETE", requirements={"id":"\d+"})
     */
    public function supplierRemove(Request $request, SupplierRepository $supplierRepository, EntityManagerInterface $em)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $supplier = $supplierRepository->findOneBy(['id' => $request->attributes->get('id')]);

        if ($supplier) {
            $em->remove($supplier);
            $em->flush();

            return $this->json([
                'message' => 'Supplier removed',
                'supplier' => $supplier
            ], 200, [], ['groups' => 'supplier']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }
}
