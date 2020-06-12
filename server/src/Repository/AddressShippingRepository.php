<?php

namespace App\Repository;

use App\Entity\AddressShipping;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method AddressShipping|null find($id, $lockMode = null, $lockVersion = null)
 * @method AddressShipping|null findOneBy(array $criteria, array $orderBy = null)
 * @method AddressShipping[]    findAll()
 * @method AddressShipping[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AddressShippingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AddressShipping::class);
    }

    // /**
    //  * @return AddressShipping[] Returns an array of AddressShipping objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?AddressShipping
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
