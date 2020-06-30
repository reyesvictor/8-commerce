<?php

namespace App\Controller;


use DateTime;
use App\Kernel;
use App\Entity\Product;
use App\Entity\Category;
use App\Entity\SubCategory;
use App\Entity\Supplier;
use App\Repository\ColorRepository;
use App\Repository\ImageRepository;
use App\Repository\ProductRepository;
use App\Repository\SubproductRepository;
use App\Repository\SupplierRepository;
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
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;

class ProductController extends AbstractController
{
    /**
     * @Route("/api/product", name="product_index", methods="GET")
     */
    public function index(Request $request, ProductRepository $productRepository, NormalizerInterface $normalizer)
    {
        $products = $productRepository->findBy(
            $request->query->get('promoted') ? ['promoted' => 1] : [],
            $request->query->get('clicks') ? ['clicks' => 'DESC'] : [],
            $request->query->get('limit'),
            $request->query->get('offset')
        );
        $count = $productRepository->countResults();
        $products = $normalizer->normalize($products, null, ['groups' => 'products']);
        $products = array_map(function ($v) {
            $path = "./images/" . $v['id'] . "/default";
            if (!is_dir($path)) return $v;

            $imgArray = (array_diff(scandir($path), [".", ".."]));
            $imgArray = array_map(function ($img) use ($v) {
                return "/api/image/" . $v['id'] . "/default/$img";
            }, $imgArray);

            $i = 0;
            foreach ($v["subproducts"] as $subproduct) {
                $price = $subproduct["promo"] ? $subproduct["price"] - ($subproduct["price"] * ($subproduct["promo"] / 100)) : $subproduct["price"];
                if ($i == 0) {
                    $v["basePrice"] = $subproduct["price"];
                    $v["price"] = $price;
                    $v["promo"] = $subproduct["promo"];
                    $i++;
                } else if ($price < $v["price"]) {
                    $v["basePrice"] = $subproduct["price"];
                    $v["price"] = $price;
                    $v["promo"] = $subproduct["promo"];
                }
            }
            return array_merge($v, ["images" => array_values($imgArray)]);
        }, $products);

        return $this->json(['nbResults' => $count, 'data' => $products], 200, [], ['groups' => 'products']);
    }

    /**
     * @Route("/api/product/count", name="product_count", methods="GET")
     */
    public function productCount(Request $request, ProductRepository $productRepository)
    {
        $count = $productRepository->countResults();
        return $this->json(['total_products_count'], 200);
    }
    /**
     * @Route("/api/product", name="product_create", methods="POST")
     */
    public function productCreate(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, ValidatorInterface $validator, SupplierRepository $supplierRepository)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            $product = $serializer->deserialize($jsonContent, Product::class, 'json', [
                AbstractNormalizer::IGNORED_ATTRIBUTES => ['subcategory', 'subproducts', 'promoted'],
                ObjectNormalizer::DISABLE_TYPE_ENFORCEMENT => true
            ]);
            if (!isset($req->subcategory)) return $this->json(['message' => 'subcategory missing'], 400, []);
            $subCategory = $this->getDoctrine()
                ->getRepository(SubCategory::class)
                ->find($req->subcategory);
            if (!isset($subCategory)) return $this->json(['message' => 'subcategory not found'], 400, []);

            if (!isset($req->supplier)) return $this->json(['message' => 'supplier missing'], 400, []);
            $supplier = $supplierRepository->findOneBy(['id' => $req->supplier]);
            if (!isset($supplier)) return $this->json(['message' => 'supplier not found'], 400, []);

            if (!isset($req->promoted)) return $this->json(['message' => 'Promoted is missing'], 400, []);

            $product->setPromoted($req->promoted);
            $product->setSupplier($supplier);
            $product->setSubCategory($subCategory);
            $product->setCreatedAt(new DateTime());

            $error = $validator->validate($product);
            if (count($error) > 0) return $this->json($error, 400);

            $em->persist($product);
            $em->flush();

            return $this->json(['messgae' => 'created', 'product' => $product], 201, [], ['groups' => 'products']);
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
                    return is_numeric($v) || $v == "default";
                });

                foreach ($colorIdArr as $v) {
                    $path = "/api/image/$productId/$v";
                    $ColorImgLinks["color_id"] = $v;
                    $imgLinks = array_diff(scandir("./images/$productId/$v"), [".", ".."]);
                    $imgLinks = array_map(function ($v) use ($path) {
                        return "$path/$v";
                    }, $imgLinks);

                    $ColorImgLinks["links"] = array_values($imgLinks);
                    $imgArray[] = $ColorImgLinks;
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
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            $product = $productRepository->findOneBy(['id' => $request->attributes->get('id')]);;
            if ($product) {
                try {
                    $product = $serializer->deserialize($jsonContent, Product::class, 'json', [
                        AbstractNormalizer::IGNORED_ATTRIBUTES => ['subcategory', 'subproducts', 'promo', 'promoted'],
                        AbstractNormalizer::OBJECT_TO_POPULATE => $product
                    ]);
                } catch (NotNormalizableValueException $e) {
                    return $this->json(['message' => $e->getMessage()], 400, []);
                }
                if (isset($req->subcategory)) {
                    $subcategory = $this->getDoctrine()->getRepository(SubCategory::class)->find($req->subcategory);
                    if (!isset($subcategory)) return $this->json(['message' => 'subcategory not found'], 400, []);
                    $product->setSubCategory($subcategory);
                }
                if (isset($req->promo)) {
                    $promoNb = $req->promo === 0 ? null : $req->promo;
                    $product->setPromo($promoNb);
                }

                if (isset($req->promoted)) {
                    $product->setPromoted($req->promoted);
                }

                if (isset($req->supplier_id)) {
                    $supplier = $this->getDoctrine()->getRepository(Supplier::class)->find($req->supplier_id);
                    if (!isset($supplier)) return $this->json(['message' => 'supplier not found'], 400, []);
                    $product->setSupplier($supplier);
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
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

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

            $price = $v["promo"] ? $v["price"] - ($v["price"] * ($v["promo"] / 100)) : $v["price"];
            $v["basePrice"] = $v["price"];
            $v["price"] = $price;

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

            $price = $v["promo"] ? $v["price"] - ($v["price"] * ($v["promo"] / 100)) : $v["price"];
            $v["basePrice"] = $v["price"];
            $v["price"] = $price;

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
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

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

    /**
     * @Route("/api/product/promoted", name="product_promoted", methods="GET")
     */
    public function promotedProduct(ProductRepository $productRepository)
    {
        $products = $productRepository->findBy(['promoted' => 1]);
        if (!$products) {
            return $this->json(['message' => 'No product in promotion'], 404);
        }
        return $this->json($products, 200, [], ['groups' => 'products']);
    }
}
