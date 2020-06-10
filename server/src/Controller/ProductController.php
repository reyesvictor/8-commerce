<?php

namespace App\Controller;


use DateTime;
use App\Kernel;
use App\Entity\Product;
use App\Entity\Category;
use App\Entity\SubCategory;
use App\Repository\ColorRepository;
use App\Repository\ImageRepository;
use App\Repository\ProductRepository;
use App\Repository\SubproductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;

class ProductController extends AbstractController
{
    /**
     * @Route("/api/product", name="product_index", methods="GET")
     */
    public function index(Request $request, ProductRepository $productRepository, NormalizerInterface $normalizer)
    {
        $count = $productRepository->countResults();
        $products = $productRepository->findBy([], array('clicks' => 'DESC'), $request->query->get('limit'), $request->query->get('offset'));
        $products = $normalizer->normalize($products, null, ['groups' => 'products']);
        $products = array_map(function ($v) {
            $path = "./images/" . $v['id'] . "/default";
            if (!is_dir($path)) return $v;

            $imgArray = (array_diff(scandir($path), [".", ".."]));
            $imgArray = array_map(function ($img) use ($v) {
                return "/api/image/" . $v['id'] . "/default/$img";
            }, $imgArray);
            return array_merge($v, ["images" => array_values($imgArray)]);
        }, $products);

        return $this->json(['nbResults' => $count, 'data' => $products], 200, [], ['groups' => 'products']);
    }

    /**
     * @Route("/api/product", name="product_create", methods="POST")
     */
    public function productCreate(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, ValidatorInterface $validator)
    {
        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            $product = $serializer->deserialize($jsonContent, Product::class, 'json', [
                AbstractNormalizer::IGNORED_ATTRIBUTES => ['subcategory', 'subproducts'],
                ObjectNormalizer::DISABLE_TYPE_ENFORCEMENT => true
            ]);
            if (!isset($req->subcategory)) return $this->json(['message' => 'subcategory missing'], 400, []);
            $subCategory = $this->getDoctrine()
                ->getRepository(SubCategory::class)
                ->find($req->subcategory);
            $product->setSubCategory($subCategory);
            $product->setCreatedAt(new DateTime());

            $error = $validator->validate($product);
            if (count($error) > 0) return $this->json($error, 400);

            $em->persist($product);
            $em->flush();

            return $this->json(['product' => $product], 201, [], ['groups' => 'products']);
        } catch (NotEncodableValueException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * @Route("/api/product/{id}", name="product_details", methods="GET", requirements={"id":"\d+"})
     */
    public function productDetails(Request $request, ProductRepository $productRepository, NormalizerInterface $normalizer, EntityManagerInterface $em)
    {
        $productId = $request->attributes->get('id');
        $product = $productRepository->findOneBy(['id' => $productId]);

        if ($product) {
            $productResp = $normalizer->normalize($product, null, ['groups' => 'products']);
            $sum = $productRepository->findStockSum($product);
            $productResp = array_merge($productResp, $sum[0]);

            if (is_dir("./images/$productId")) {
                $imgArray = [];
                $colorIdArr = scandir("./images/$productId");
                $colorIdArr = array_filter($colorIdArr, function ($v) {
                    return is_numeric($v);
                });

                $path = "/api/image/$productId";
                $ColorImgLinks["color_id"] = "default";
                $imgLinks = array_diff(scandir("./images/$productId/default"), [".", ".."]);
                $imgLinks = array_map(function ($v) use ($path) {
                    return "$path/default/$v";
                }, $imgLinks);

                $ColorImgLinks["links"] = array_values($imgLinks);
                array_push($imgArray, $ColorImgLinks);
                foreach ($colorIdArr as $v) {
                    $path = "/api/image/$productId/$v";
                    $ColorImgLinks["color_id"] = $v;
                    $imgLinks = array_diff(scandir("./images/$productId/$v"), [".", ".."]);
                    $imgLinks = array_map(function ($v) use ($path) {
                        return "$path/$v";
                    }, $imgLinks);

                    $ColorImgLinks["links"] = array_values($imgLinks);
                    array_push($imgArray, $ColorImgLinks);
                }
                $productResp = array_merge($productResp, ["images" => $imgArray]);
            }

            $product->setClicks($product->getClicks() + 1);
            $em->persist($product);
            $em->flush();
            return $this->json($productResp, 200, [], ['groups' => 'products']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/product/{id}", name="product_update", methods="PUT", requirements={"id":"\d+"})
     */
    public function productUpdate(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, SerializerInterface $serializer, ProductRepository $productRepository)
    {
        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            $product = $productRepository->findOneBy(['id' => $request->attributes->get('id')]);;
            if ($product) {
                try {
                    $product = $serializer->deserialize($jsonContent, Product::class, 'json', [
                        AbstractNormalizer::IGNORED_ATTRIBUTES => ['subcategory', 'subproducts', 'promo'],
                        AbstractNormalizer::OBJECT_TO_POPULATE => $product
                    ]);
                } catch (NotNormalizableValueException $e) {
                    return $this->json(['message' => $e->getMessage()], 400, []);
                }
                if (isset($req->subcategory)) {
                    $subcategory = $this->getDoctrine()->getRepository(SubCategory::class)->find($req->subcategory);
                    $product->setSubCategory($subcategory);
                }
                if (isset($req->promo)) {
                    $promoNb = $req->promo === 0 ? null : $req->promo;
                    $product->setPromo($promoNb);
                }

                $error = $validator->validate($product);
                if (count($error) > 0) return $this->json($error, 400);

                $em->persist($product);
                $em->flush();

                return $this->json(['product' => $product], 200, [], ['groups' => 'products', AbstractNormalizer::IGNORED_ATTRIBUTES => ['subproducts']]);
            } else {
                return $this->json(['message' => 'product not found'], 404, []);
            }
        } catch (NotEncodableValueException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * @Route("/api/product/{id}", name="product_remove", methods="DELETE", requirements={"id":"\d+"})
     */
    public function productRemove(Request $request, ProductRepository $productRepository, EntityManagerInterface $em)
    {
        $product = $productRepository->findOneBy(['id' => $request->attributes->get('id')]);

        if ($product) {
            $em->remove($product);
            $em->flush();

            return $this->json([
                'message' => 'product removed',
                'product' => $product
            ], 200, [], ['groups' => 'products']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }


    /**
     * @Route("/api/product/search", name="product_search", methods="POST")
     */
    public function productSearch(Request $request, ProductRepository $productRepository, NormalizerInterface $normalizer)
    {
        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }

        $products = $productRepository->findSearchProduct($data);
        $products = $normalizer->normalize($products, null, ['groups' => 'products']);
        $products = array_map(function ($v) {
            $path = "./images/" . $v['product_id'] . "/default";
            if (!is_dir($path)) return $v;

            $imgArray = (array_diff(scandir($path), [".", ".."]));
            $imgArray = array_map(function ($img) use ($v) {
                return "/api/image/" . $v['product_id'] . "/default/$img";
            }, $imgArray);
            return array_merge($v, ["images" => array_values($imgArray)]);
        }, $products);
        
        $catSubcat = $productRepository->findSearchCategorySubcategory($data);

        return $this->json(['products' => $products, 'catsubcat' => $catSubcat], 200);
    }

    /**
     * @Route("/api/product/filter", name="product_filter", methods="POST")
     */
    public function filterProducts(Request $request, ProductRepository $productRepository, NormalizerInterface $normalizer)
    {
        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }

        $products = $productRepository->filterProducts($data, $request->query->get('limit'), $request->query->get('offset'));
        $products = $normalizer->normalize($products, null, ['groups' => 'products']);
        $products = array_map(function ($v) {
            $path = "./images/" . $v['product_id'] . "/default";
            if (!is_dir($path)) return $v;

            $imgArray = (array_diff(scandir($path), [".", ".."]));
            $imgArray = array_map(function ($img) use ($v) {
                return "/api/image/" . $v['product_id'] . "/default/$img";
            }, $imgArray);
            return array_merge($v, ["images" => array_values($imgArray)]);
        }, $products);
        return $this->json($products, 200);
    }


    /**
     * @Route("/api/image/{productid}/{colorid}/{imagename}", name="get_image", methods="GET" , requirements={"productid":"\d+"})
     */
    public function getImage(Request $request)
    {
        $productId = $request->attributes->get('productid');
        $colorId = $request->attributes->get('colorid');
        $imageName = $request->attributes->get('imagename');

        $name = "./images/$productId/$colorId/$imageName";
        $fp = fopen($name, 'rb');

        header("Content-Type: image/jpg");
        header("Content-Length: " . filesize($name));

        return new Response(fpassthru($fp), 200);
    }


    /**
     * @Route("/api/image/{id}", name="product_add_image", methods="POST",requirements={"id":"\d+"})
     */
    public function addImage(Request $request)
    {

        $productId = $request->attributes->get('id');
        $uploadedFile = $request->files->get('image');
        $colorId = $request->request->get('color');
        $name = "./images/$productId/$colorId/";

        $ext = $uploadedFile->getClientOriginalExtension();

        if (!in_array($ext, ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG'])) {
            return $this->json([
                'message' => 'Wrong extension'
            ], 400);
        }

        if (isset($colorId) && isset($uploadedFile) && isset($productId)) {

            $filename = is_dir($name) && count(array_diff(scandir($name), array('.', '..'))) > 0 ?  (count(array_diff(scandir($name), array('.', '..'))) + 1) . '.' . $ext : "1" . '.' . $ext;

            $file = $uploadedFile->move($name, $filename);

            return $this->json([
                'message' => 'Picture correctly added'
            ], 200);
        } else {

            return $this->json([
                'message' => 'Not found'
            ], 404);
        }
    }
}
