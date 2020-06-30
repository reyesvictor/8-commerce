<?php

namespace App\Controller;

use App\Entity\Color;
use App\Entity\Subproduct;
use App\Repository\ProductRepository;
use App\Repository\ColorRepository;
use App\Repository\SubproductRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Image;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PropertyInfo\Extractor\ReflectionExtractor;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class SubProductController extends AbstractController
{
    /**
     * @Route("/api/subproduct", name="subproduct_index" , methods="GET")
     */
    public function subproductIndex(Request $request, NormalizerInterface $normalizer, SubproductRepository $subproductRepository)
    {
        $count = $subproductRepository->countAllResults();
        $subProduct = $subproductRepository->findBy([], null, $request->query->get('limit'), $request->query->get('offset'));
        $subProduct = $normalizer->normalize($subProduct, null, ['groups' => 'subproduct']);

        return $this->json(['nbResults' => $count, 'data' => $subProduct], 200, [], ['groups' => 'subproduct']);
    }

    /**
     * @Route("/api/subproduct/{id}", name="subproduct_get",methods="GET", requirements={"id":"\d+"})
     */
    public function subProductDetails(Request $request, SubproductRepository $subproductRepository)
    {
        $subProduct = $subproductRepository->findOneBy(['id' => $request->attributes->get('id')]);
        if ($subProduct) {
            return $this->json($subProduct, 200, [], ['groups' => 'subproduct']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/subproduct", name="subproduct_create", methods="POST")
     */
    public function subProductCreate(Request $request, SerializerInterface $serializer, ProductRepository $productRepository, SubproductRepository $subproductRepository, EntityManagerInterface $em, ValidatorInterface $validator)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        try {
            $jsonContent = $request->getContent();
            $data = json_decode($jsonContent);

            try {
                $subproduct = $serializer->deserialize($jsonContent, Subproduct::class, 'json', [AbstractNormalizer::IGNORED_ATTRIBUTES => ['color', 'product', 'size']]);
            } catch (NotNormalizableValueException $e) {
                return $this->json(['message' => $e->getMessage()], 400);
            }

            if (!isset($data->color_id)) return $this->json(['message' => 'color id missing.'], 400);
            $color = $this->getDoctrine()->getRepository(Color::class)->find($data->color_id);
            if (!$color) return $this->json(['message' => 'color not found.'], 404);

            
            if (!isset($data->product_id)) return $this->json(['message' => 'product id missing.'], 400);
            $product = $productRepository->findOneBy(['id' => $data->product_id]);
            if (!$product) return $this->json(['message' => 'product not found.'], 404);
            
            if (!isset($data->size)) return $this->json(['message' => 'Size is missing.'], 400);
            if ($subproductRepository->findOneBy(['color' => $color, 'size' => $data->size, 'product' => $product])) return $this->json(['message' => 'SubProduct already exists'], 400);

            $subproduct->setSize(strtoupper($data->size));
            $subproduct->setColor($color);
            $subproduct->setCreatedAt(new \DateTime());
            $subproduct->setProduct($product);

            $error = $validator->validate($subproduct);
            if (count($error) > 0) return $this->json($error, 400);

            $em->persist($subproduct);
            $em->flush();

            if (!file_exists("./images/$data->product_id/$data->color_id")) {
                mkdir("./images/$data->product_id/$data->color_id", 0777, true);
            }

            return $this->json([
                'message' => 'created',
                'subProduct' => $subproduct
            ], 201, [], ['groups' => 'subproduct']);
        } catch (NotEncodableValueException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * @Route("/api/subproduct/{id}", name="subproduct_update", methods="PUT")
     */
    public function subProductUpdate(Request $request, EntityManagerInterface $em, SerializerInterface $serializer, ValidatorInterface $validator, SubproductRepository $subproductRepository, ColorRepository $colorRepository)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        try {
            $subProduct = $subproductRepository->findOneBy(['id' => $request->attributes->get('id')]);
            if ($subProduct) {
                $jsonContent = $request->getContent();
                $data = json_decode($jsonContent);
                try {
                    //AbstractNormalizer::IGNORED_ATTRIBUTES => ['subcategory', 'subproducts', 'promo']
                    $subProduct = $serializer->deserialize($jsonContent, Subproduct::class, 'json', [
                        AbstractNormalizer::OBJECT_TO_POPULATE => $subProduct
                    ]);
                    if (isset($data->color_id)) {
                        $color = $colorRepository->findOneBy(['id' => $data->color_id]);
                        $subProduct->setColor($color);
                    }
                } catch (NotNormalizableValueException $e) {
                    return $this->json(['message' => $e->getMessage()], 400, []);
                }

                $error = $validator->validate($subProduct);
                if (count($error) > 0) return $this->json($error, 400);

                $em->persist($subProduct);
                $em->flush();

                return $this->json(['subProduct' => $subProduct], 200, [], ['groups' => 'products']);
            } else {
                return $this->json(['message' => 'product not found'], 404, []);
            }
        } catch (NotEncodableValueException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * @Route("/api/subproduct/{id}", name="subproduct_remove", methods="DELETE")
     */
    public function subProductRemove(Request $request, SubproductRepository $subproductRepository, EntityManagerInterface $em)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $subproduct = $subproductRepository->findOneBy(['id' => $request->attributes->get('id')]);

        if ($subproduct) {
            $em->remove($subproduct);
            $em->flush();

            return $this->json([
                'message' => 'subProduct removed',
                'subProduct' => $subproduct
            ], 200, [], ['groups' => 'products']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }
}
