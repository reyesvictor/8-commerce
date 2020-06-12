<?php

namespace App\Repository;

use App\Entity\AddressBilling;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method AddressBilling|null find($id, $lockMode = null, $lockVersion = null)
 * @method AddressBilling|null findOneBy(array $criteria, array $orderBy = null)
 * @method AddressBilling[]    findAll()
 * @method AddressBilling[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AddressBillingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AddressBilling::class);
    }

    // /**
    //  * @return AddressBilling[] Returns an array of AddressBilling objects
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
    public function findOneBySomeField($value): ?AddressBilling
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
