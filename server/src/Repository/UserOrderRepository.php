<?php

namespace App\Repository;

use App\Entity\UserOrder;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method UserOrder|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserOrder|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserOrder[]    findAll()
 * @method UserOrder[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserOrderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserOrder::class);
    }

    // /**
    //  * @return UserOrder[] Returns an array of UserOrder objects
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

    //SELECT COUNT(user_id) FROM user_order WHERE user_id IS NOT NULL 


    public function countRegisteredBuyersResults()
    {
        return $this->createQueryBuilder('u')
            ->select('count(DISTINCT u.user)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function countUnregisteredBuyersResults()
    {
        $conn = $this->getEntityManager()
            ->getConnection();
        $sql = "SELECT COUNT(id) as unregistered_buyers FROM user_order WHERE user_id IS NULL";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function countAllOrders()
    {
        return $this->createQueryBuilder('u')
            ->select('count(u.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function countTotalPrice()
    {
        return $this->createQueryBuilder('u')
            ->select('sum(u.cost)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function countTotalProductsSold()
    {
        return $this->createQueryBuilder('u')
            ->leftJoin('u.userOrderSubproducts', 'uos')
            ->select('count(uos.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function countOrdersPerRegion()
    {
        return $this->createQueryBuilder('u')
            ->leftJoin('u.addressBilling', 'ab')
            ->leftJoin('ab.region', 'r')
            ->select('count(r.name) as nb_orders, r.name')
            ->groupBy('r.name')
            ->getQuery()
            ->getResult();
    }

    public function countNbProductsPerOrders()
    {
        return $this->createQueryBuilder('u')
            ->leftJoin('u.userOrderSubproducts', 'uos')
            ->select('count(uos.id) as nb_products')
            ->groupBy('uos.userOrder')
            ->getQuery()
            ->getResult();
    }

    // SELECT COUNT(id) FROM user_order WHERE user_id IS NULL

    /*
    public function findOneBySomeField($value): ?UserOrder
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
