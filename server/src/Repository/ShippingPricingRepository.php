<?php

namespace App\Repository;

use App\Entity\ShippingPricing;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ShippingPricing|null find($id, $lockMode = null, $lockVersion = null)
 * @method ShippingPricing|null findOneBy(array $criteria, array $orderBy = null)
 * @method ShippingPricing[]    findAll()
 * @method ShippingPricing[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ShippingPricingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ShippingPricing::class);
    }

    // /**
    //  * @return ShippingPricing[] Returns an array of ShippingPricing objects
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
    public function findOneBySomeField($value): ?ShippingPricing
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
