<?php

namespace App\Repository;

use App\Entity\Packaging;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Packaging|null find($id, $lockMode = null, $lockVersion = null)
 * @method Packaging|null findOneBy(array $criteria, array $orderBy = null)
 * @method Packaging[]    findAll()
 * @method Packaging[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PackagingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Packaging::class);
    }

    public function findByAvailable($date, $spending)
    {
        $date = $date->format('Y-m-d H:i:s');

        $conn = $this->getEntityManager()
            ->getConnection();
        $sql = "SELECT * FROM packaging
        WHERE (DAYOFYEAR(:now) BETWEEN DAYOFYEAR(starts_at) AND DAYOFYEAR(ends_at)) AND min_spending <= :spending";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":now", $date);
        $stmt->bindParam(":spending", $spending, \PDO::PARAM_INT);

        $stmt->execute();
        return $stmt->fetchAll();
    }

    // /**
    //  * @return Packaging[] Returns an array of Packaging objects
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
    public function findOneBySomeField($value): ?Packaging
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
