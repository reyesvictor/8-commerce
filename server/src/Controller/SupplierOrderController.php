<?php

namespace App\Controller;

use App\Entity\Subproduct;
use App\Entity\Supplier;
use App\Entity\SupplierOrder;
use App\Entity\SupplierOrderSubproduct;
use App\Repository\SubproductRepository;
use App\Repository\SupplierOrderRepository;
use App\Repository\SupplierOrderSubproductRepository;
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

class SupplierOrderController extends AbstractController
{
    /**
     * @Route("/api/supplier/order", name="supplier_order_index" , methods="GET")
     */
    public function index(Request $request, NormalizerInterface $normalizer, SupplierOrderRepository $supplierOrderRepository)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $count = $supplierOrderRepository->countAllResults();
        $supplierOrders = $supplierOrderRepository->findBy([], null, $request->query->get('limit'), $request->query->get('offset'));
        $supplierOrders = $normalizer->normalize($supplierOrders, null, ['groups' => 'supplierOrders']);

        return $this->json(['nbResults' => $count, 'data' => $supplierOrders], 200, [], ['groups' => 'supplierOrders']);
    }

    /**
     * @Route("/api/supplier/order/{id}", name="supplier_order_details",methods="GET", requirements={"id":"\d+"})
     */
    public function supplierOrderDetails(Request $request, SupplierOrderRepository $supplierOrderRepository)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $supplierOrder = $supplierOrderRepository->find($request->attributes->get('id'));

        if ($supplierOrder) {
            return $this->json($supplierOrder, 200, [], ['groups' => 'supplier_order_details']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/supplier/order", name="supplier_order_create", methods="POST")
     */
    public function supplierOrderCreate(Request $request, EntityManagerInterface $em, SerializerInterface $serializer, ValidatorInterface $validator)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);

            try {
                $supplierOrder = $serializer->deserialize($jsonContent, SupplierOrder::class, 'json', [AbstractNormalizer::IGNORED_ATTRIBUTES => ['subproduct', 'supplier']]);
            } catch (NotNormalizableValueException $e) {
                return $this->json(['message' => $e->getPrevious()->getMessage()], 400);
            }

            if (!isset($req->supplier_id)) return $this->json(['message' => 'supplier_id missing'], 400, []);
            $supplier = $this->getDoctrine()
                ->getRepository(Supplier::class)
                ->find($req->supplier_id);
            if (!isset($supplier)) return $this->json(['message' => 'Supplier not found'], 400, []);

            $supplierOrder->setSupplier($supplier);

            $error = $validator->validate($supplierOrder);
            if (count($error) > 0) return $this->json($error, 400);

            $supplierOrder->setCreatedAt(new \DateTime());
            $em->persist($supplierOrder);
            $em->flush();

            return $this->json(['SupplierOrder' => $supplierOrder], 201, [], ['groups' => 'supplierOrders']);
        } catch (NotEncodableValueException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * @Route("/api/supplier/order/{id}", name="supplier_order_update", methods="PUT", requirements={"id":"\d+"})
     */
    public function supplierOrderUpdate(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, SerializerInterface $serializer, SupplierOrderRepository $supplierOrderRepository, SubproductRepository $subproductRepository)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        try {
            $supplierOrder = $supplierOrderRepository->findOneBy(['id' => $request->attributes->get('id')]);;
            if ($supplierOrder) {
                try {
                    $jsonContent = $request->getContent();
                    $req = json_decode($jsonContent);

                    $supplierOrder = $serializer->deserialize($jsonContent, SupplierOrder::class, 'json', [
                        AbstractNormalizer::IGNORED_ATTRIBUTES => ['subproduct', 'supplier', 'status'],
                        AbstractNormalizer::OBJECT_TO_POPULATE => $supplierOrder
                    ]);
                } catch (NotNormalizableValueException $e) {
                    return $this->json(['message' => $e->getMessage()], 400, []);
                }
                if (isset($req->supplier_id)) {
                    $supplier = $this->getDoctrine()
                        ->getRepository(Supplier::class)
                        ->find($req->supplier_id);
                    if (!isset($supplier)) return $this->json(['message' => 'Supplier not found'], 400, []);
                    $supplierOrder->setSupplier($supplier);
                }

                if(isset($req->status) && $req->status == true && $supplierOrder->getStatus() != true) {
                    $supplierOrderSubproduct = $supplierOrder->getSupplierOrderSubproducts();
                    foreach ($supplierOrderSubproduct as $value) {
                        $quantity = ($value->getQuantity());
                        $subprod = ($value->getSubproduct());
                        $subprod->setStock($subprod->getStock() + $quantity);
                        $em->persist($subprod);
                    }
                    $supplierOrder->setStatus(true);
                }

                if(isset($req->status) && $req->status == false) $supplierOrder->setStatus(false);

                $error = $validator->validate($supplierOrder);
                if (count($error) > 0) return $this->json($error, 400);

                $em->persist($supplierOrder);
                $em->flush();

                return $this->json(['supplierOrder' => $supplierOrder], 200, [], ['groups' => 'supplierOrders', AbstractNormalizer::IGNORED_ATTRIBUTES => ['subproduct']]);
            } else {
                return $this->json(['message' => 'product not found'], 404, []);
            }
        } catch (NotEncodableValueException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * @Route("/api/supplier/order/{id}/add", name="supplier_order_add_subproduct", methods="POST", requirements={"id":"\d+"})
     */
    public function supplierOderAddSubproduct(Request $request, EntityManagerInterface $em, SupplierOrderRepository $supplierOrderRepository, SubproductRepository $subproductRepository) {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $jsonContent = $request->getContent();
        $req = json_decode($jsonContent);

        if(!isset($req->subproduct_id)) return $this->json(['message' => 'subproduct_id not found'], 400); 
        $subproduct = $subproductRepository->find($req->subproduct_id);
        if(!isset($subproduct)) return $this->json(['message' => 'Subproduct not found'], 400); 

        $supplierOrder = $supplierOrderRepository->find($request->attributes->get('id'));
        if(!isset($supplierOrder)) return $this->json(['message' => 'SupplierOrder not found'], 400); 

        $orderSubproduct = new SupplierOrderSubproduct();

        if(!isset($req->quantity)) return $this->json(['message' => 'quantity missing'], 400); 
        
        $orderSubproduct->setQuantity($req->quantity);
        $orderSubproduct->setSubproduct($subproduct);
        $orderSubproduct->setSupplierOrder($supplierOrder);

        $em->persist($orderSubproduct);
        $em->flush();

        return $this->json(['message' => 'Subproduct added', 'subproduct' => $orderSubproduct], 200, [], ['groups' => 'supplier_order_details']);
    }

    /**
     * @Route("/api/supplier/order/{id}", name="supplier_order_remove", methods="DELETE", requirements={"id":"\d+"})
     */
    public function supplierRemove(Request $request, SupplierOrderRepository $supplierOrderRepository, EntityManagerInterface $em)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $supplierOrder = $supplierOrderRepository->findOneBy(['id' => $request->attributes->get('id')]);

        if ($supplierOrder) {
            $em->remove($supplierOrder);
            $em->flush();

            return $this->json([
                'message' => 'supplierOrder removed',
                'supplier' => $supplierOrder
            ], 200, [], ['groups' => 'supplierOrder']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }
}
