<?php

namespace App\Repository;

use App\Entity\RestrictedRegion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method RestrictedRegion|null find($id, $lockMode = null, $lockVersion = null)
 * @method RestrictedRegion|null findOneBy(array $criteria, array $orderBy = null)
 * @method RestrictedRegion[]    findAll()
 * @method RestrictedRegion[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RestrictedRegionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RestrictedRegion::class);
    }

    // /**
    //  * @return RestrictedRegion[] Returns an array of RestrictedRegion objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('r.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?RestrictedRegion
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
