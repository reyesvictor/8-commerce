<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use PDO;

/**
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    public function findStockSum($product)
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.subproducts', 'sp')
            ->select('SUM(sp.stock) as totalStock')
            ->andWhere('p.id = :id')
            ->setParameter('id', $product->getId())
            ->getQuery()
            ->getResult();
    }

    public function findSearchProduct($data)
    {
        $conn = $this->getEntityManager()
            ->getConnection();
        $sql = "SELECT * FROM product 
        LEFT JOIN subproduct ON product.id = subproduct.product_id 
        WHERE title REGEXP ? GROUP BY product.id ORDER BY product.clicks DESC LIMIT 5";
        // OR description REGEXP ?  IF WE WANT TO ADD BY DESCRIPTION AS WELL
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(1, $data['search'], PDO::PARAM_STR);
        // $stmt->bindParam(2, $searchString, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findSearchCategorySubcategory($data)
    {
        $results = [];
        $conn = $this->getEntityManager()
            ->getConnection();
        $sql = "SELECT * FROM category 
        WHERE name REGEXP ? LIMIT 5";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(1, $data['search'], PDO::PARAM_STR);
        $stmt->execute();
        array_push($results,['category' => $stmt->fetchAll()]);
        $conn = $this->getEntityManager()
            ->getConnection();
        $sql = "SELECT * FROM sub_category 
        WHERE name REGEXP ? LIMIT 5";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(1, $data['search'], PDO::PARAM_STR);
        $stmt->execute();
        array_push($results,['subcategory' => $stmt->fetchAll()]);
        return $results;
    }

    public function countResults()
    {
        return $this->createQueryBuilder('u')
            ->select('count(u.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function filterProducts($data, $limit, $offset)
    {
        $query = "SELECT * FROM product 
        LEFT JOIN subproduct ON product.id = subproduct.product_id 
        LEFT JOIN color ON subproduct.color_id = color.id 
        LEFT JOIN sub_category ON product.sub_category_id = sub_category.id
        LEFT JOIN category ON sub_category.category_id = category.id WHERE ";
        $arrayExecute = [];
        if (isset($data['search']) && $data['search']) {
            $query .= ' (product.title REGEXP ? OR product.description REGEXP ?) AND ';
            array_push($arrayExecute, $data['search'], $data['search']);
        }
        if (isset($data['price']) && $data['price']) {
            $query .= ' (subproduct.price > ? AND subproduct.price < ?) AND ';
            array_push($arrayExecute, $data['price']['start'], $data['price']['end']);
        }
        if (isset($data['sex']) && $data['sex']) {
            $query .= ' product.sex = ? AND ';
            array_push($arrayExecute, $data['sex']);
        }
        if (isset($data['size']) && $data['size']) {
            $query .= '(';
            foreach ($data['size'] as $key => $value) {
                $query .= ' subproduct.size = ? OR ';
                array_push($arrayExecute, $value);
            }
            $query = substr($query, 0, -3);
            $query .= ') AND ';
        }
        if (isset($data['color']) && $data['color']) {
            $query .= '(';
            foreach ($data['color'] as $key => $value) {
                $query .= ' color.name = ? OR ';
                array_push($arrayExecute, $value);
            }
            $query = substr($query, 0, -3);
            $query .= ') AND ';
        }
        if (isset($data['category']) && $data['category']) {
            $query .= ' category.name = ? AND ';
            array_push($arrayExecute, $data['category']);
        }
        if (isset($data['subcategory']) && $data['subcategory']) {
            $query .= ' sub_category.name = ?  ';
            array_push($arrayExecute, $data['subcategory']);
        }
        if (substr($query, -6) == "WHERE ") {
            $query = substr($query, 0, -6);
        }
        if (substr($query, -4) == "AND ") {
            $query = substr($query, 0, -4);
        }
        $query .= ' GROUP BY product.id ';
        if (isset($data['order_by']) && $data['order_by']) {
            switch ($data['order_by']) {
                case 'popularity':
                    $query .= ' ORDER BY product.clicks ';
                    break;
                case 'price':
                    $query .= ' ORDER BY subproduct.price ';
                    break;
                case 'name':
                    $query .= ' ORDER BY product.title ';
                    break;
            }
        }
        if (isset($data['order_by_sort']) && $data['order_by_sort'] == "desc") {
            $query .= ' DESC ';
        } else {
            $query .= ' ASC ';
        }
        if (isset($limit) && isset($offset)) {
            array_push($arrayExecute, intval($limit), intval($offset));
            $query .= " LIMIT ? OFFSET ?";
        }
        $conn = $this->getEntityManager()
            ->getConnection();
        $stmt = $conn->prepare($query);
        for ($i = 1; $i <= sizeof($arrayExecute); $i++) {
            if (gettype($arrayExecute[$i - 1]) == 'integer') {
                $stmt->bindParam($i, $arrayExecute[$i - 1], PDO::PARAM_INT);
            } else {
                $stmt->bindParam($i, $arrayExecute[$i - 1]);
            }
        }
        $stmt->execute();
        return $stmt->fetchAll();
        // $products = $stmt->fetchAll();
        // if (!empty($products)) {
        //     $productIds = [];
        //     foreach ($products as $key => $value) {
        //         array_push($productIds, $value['id']);
        //     }
        //     $newQuery = "SELECT * FROM product WHERE id IN(" . implode(',', $productIds) . ")";
        //     $stmt = $conn->prepare($newQuery);
        //     $stmt->execute();
        //     return $stmt->fetchAll();
        // }
        // return [];
    }


    // /**
    //  * @return Product[] Returns an array of Product objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Product
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
