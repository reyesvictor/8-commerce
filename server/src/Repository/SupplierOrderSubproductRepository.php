<?php

namespace App\Repository;

use App\Entity\SupplierOrderSubproduct;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method SupplierOrderSubproduct|null find($id, $lockMode = null, $lockVersion = null)
 * @method SupplierOrderSubproduct|null findOneBy(array $criteria, array $orderBy = null)
 * @method SupplierOrderSubproduct[]    findAll()
 * @method SupplierOrderSubproduct[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SupplierOrderSubproductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SupplierOrderSubproduct::class);
    }

    // /**
    //  * @return SupplierOrderSubproduct[] Returns an array of SupplierOrderSubproduct objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?SupplierOrderSubproduct
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
