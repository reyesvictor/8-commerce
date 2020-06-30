<?php

namespace App\Repository;

use App\Entity\UserOrderSubproduct;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method UserOrderSubproduct|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserOrderSubproduct|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserOrderSubproduct[]    findAll()
 * @method UserOrderSubproduct[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserOrderSubproductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserOrderSubproduct::class);
    }

    public function getSubProduct()
    {
        $conn = $this->getEntityManager()
            ->getConnection();
        $sql = "SELECT DISTINCT subproduct_id FROM user_order_subproduct";
        // OR description REGEXP ?  IF WE WANT TO ADD BY DESCRIPTION AS WELL
        $stmt = $conn->prepare($sql);
        // $stmt->bindParam(2, $searchString, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findSubCategorySoldProduct()
    {
        return $this->createQueryBuilder('u')
            ->leftJoin('u.subproduct', 's')
            ->leftJoin('s.product', 'p')
            ->leftJoin('p.subCategory', 'sc')
            ->select('sc.name')
            ->getQuery()
            ->getResult();
    }
    
    public function findCategorySoldProduct()
    {
        return $this->createQueryBuilder('u')
            ->leftJoin('u.subproduct', 's')
            ->leftJoin('s.product', 'p')
            ->leftJoin('p.subCategory', 'sc')
            ->leftJoin('sc.Category','c')
            ->select('c.name')
            ->getQuery()
            ->getResult();
    }


    // public function findSearchProduct($data)
    // {
    //     $conn = $this->getEntityManager()
    //         ->getConnection();
    //     $sql = "SELECT * FROM category 
    //     LEFT JOIN subproduct ON product.id = subproduct.product_id 
    //     WHERE title REGEXP ? GROUP BY product.id ORDER BY product.clicks DESC LIMIT 5";
    //     // OR description REGEXP ?  IF WE WANT TO ADD BY DESCRIPTION AS WELL
    //     $stmt = $conn->prepare($sql);
    //     $stmt->bindParam(1, $data['search'], PDO::PARAM_STR);
    //     // $stmt->bindParam(2, $searchString, PDO::PARAM_STR);
    //     $stmt->execute();
    //     return $stmt->fetchAll();
    // }


    // /**
    //  * @return UserOrderSubproduct[] Returns an array of UserOrderSubproduct objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?UserOrderSubproduct
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
