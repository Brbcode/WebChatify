<?php

namespace App\Repository;

use App\Entity\MessageEditRecord;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MessageEditRecord>
 *
 * @method MessageEditRecord|null find($id, $lockMode = null, $lockVersion = null)
 * @method MessageEditRecord|null findOneBy(array $criteria, array $orderBy = null)
 * @method MessageEditRecord[]    findAll()
 * @method MessageEditRecord[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MessageEditRecordRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MessageEditRecord::class);
    }

    public function save(MessageEditRecord $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(MessageEditRecord $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return MessageEditRecord[] Returns an array of MessageEditRecord objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('m.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?MessageEditRecord
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
