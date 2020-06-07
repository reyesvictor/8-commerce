<?php

namespace App\Repository;

use App\Entity\Subproduct;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Subproduct|null find($id, $lockMode = null, $lockVersion = null)
 * @method Subproduct|null findOneBy(array $criteria, array $orderBy = null)
 * @method Subproduct[]    findAll()
 * @method Subproduct[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SubproductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Subproduct::class);
    }

    // /**
    //  * @return Subproduct[] Returns an array of Subproduct objects
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
    public function findOneBySomeField($value): ?Subproduct
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
