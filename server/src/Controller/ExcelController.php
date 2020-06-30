<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ExcelController extends AbstractController
{
    /**
     * @Route("/api/excel", name="excel_create", methods="GET")
     */
    public function ExcelCreate(EntityManagerInterface $em)
    {
        $styleArray = [
            'borders' => [
                'outline' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color' => ['argb' => '000'],
                ],
            ],
        ];
        $index = 0;
        $spreadsheet = new Spreadsheet();
    
        $tables = array_values(array_diff($em->getConnection()->getSchemaManager()->listTableNames(),["migration_versions"]));
        $entities = array_map(function($entity){
            $entities = explode('_',$entity);
            return implode(array_map('ucfirst', $entities));
        },$tables);

        foreach($entities as  $entity){
            
            $columns = array_keys($em->getConnection()->getSchemaManager()->listTableColumns($tables[$index]));
            $repository = $this->getDoctrine()->getRepository('App\\Entity\\'.$entity);
            $findItems = $repository->findAll();
        
            if( $index > 0){
                $spreadsheet->createSheet();
            }
            $spreadsheet->setActiveSheetIndex($index);
            $spreadsheet->getActiveSheet()->setTitle($entity);

            for( $i = 0 ; $i < count($columns) ; $i++ ){
                $alphabet = "A";
                $ascii = ord($alphabet);
                $ascii  = $ascii + $i;
                $pos = chr($ascii);
                
                $spreadsheet->getActiveSheet()->setCellValue($pos.'1',$columns[$i]);
                
                $name = explode('_',$columns[$i]);
                $name = implode(array_map('ucfirst', $name));
                
                $function = 'get'.$name;
                
                $num = 2;
                foreach( $findItems as $item ){
                    if(substr($columns[$i],-3) == '_id'  ){
                        $function = str_replace('Id','',$function);
                        
                        $result = $item->$function() ? $item->$function()->getId() : null;
                    }else{
                        $result = $item->$function();
                    }
                    if(is_array($result)){
                        $result = implode(',',$result);
                    }
                    $spreadsheet->getActiveSheet()->setCellValue($pos.$num,$result);
                 
                    $spreadsheet->getActiveSheet()->getStyle($pos.($num-1).':'.$pos.$num)->applyFromArray($styleArray);

                    $num++;
                }
                $spreadsheet->getActiveSheet()->getColumnDimension($pos)->setAutoSize(true);
            }
            $index++;
        }
      
        $writer = new Xlsx($spreadsheet);
        $name = 'database.xlsx';
        $temp_file = tempnam(sys_get_temp_dir(), $name);
        $writer->save($temp_file);

        return $this->file($temp_file, $name, ResponseHeaderBag::DISPOSITION_INLINE);
    
    }
}
