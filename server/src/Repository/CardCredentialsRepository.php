<?php

namespace App\Repository;

use App\Entity\CardCredentials;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method CardCredentials|null find($id, $lockMode = null, $lockVersion = null)
 * @method CardCredentials|null findOneBy(array $criteria, array $orderBy = null)
 * @method CardCredentials[]    findAll()
 * @method CardCredentials[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CardCredentialsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CardCredentials::class);
    }

    // /**
    //  * @return CardCredentials[] Returns an array of CardCredentials objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?CardCredentials
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
