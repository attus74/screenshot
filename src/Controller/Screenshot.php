<?php

namespace Drupal\screenshot\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

/**
 * Screenshot
 *
 * @author Attila Németh
 * 05.04.2021
 */
class Screenshot extends ControllerBase {
  
  public function generate(string $view): Response
  {
//    var_dump(\Drupal::request()->request->get('desktop'));
    $prefix = 'data:image/png;base64,'; 
    $image = imagecreatetruecolor(600, 450);
    $background = imagecolorallocatealpha($image, 255, 255, 239, 31);
    imagefill($image, 0, 0, $background);
    if ($view === 'desktop') {
      $data = str_replace($prefix, '', \Drupal::request()->request->get('desktop')); 
      $desktop_base64 = base64_decode($data);
      $desktop_screenshot = imagecreatefromstring($desktop_base64);
      imagecopyresampled($image, $desktop_screenshot, 0, 0, 0, 0, 600, 450, 1024, 768);
    }
    elseif ($view === 'responsive') {
      $data = str_replace($prefix, '', \Drupal::request()->request->get('desktop')['image']); 
      $desktop_base64 = base64_decode($data);
      $desktop_screenshot = imagecreatefromstring($desktop_base64);
      imagecopyresampled($image, $desktop_screenshot, 74, 48, 0, 0, 450, 300, 1024, 768);
      $desktop_icon = imagecreatefrompng(drupal_get_path('module', 'screenshot') . '/images/desktop.png');
      imagecopyresampled($image, $desktop_icon, 44, 0, 0, 0, 512, 512, 512, 512);
      $data = str_replace($prefix, '', \Drupal::request()->request->get('tablet')['image']); 
      $tablet_base64 = base64_decode($data);
      $tablet_screenshot = imagecreatefromstring($tablet_base64);
      imagecopyresampled($image, $tablet_screenshot, 18, 196, 0, 0, 167, 223, 768, 1024);
      $tablet_icon = imagecreatefrompng(drupal_get_path('module', 'screenshot') . '/images/tablet.png');
      imagecopyresampled($image, $tablet_icon, 0, 180, 0, 0, 200, 270, 1778, 2400);
      $data = str_replace($prefix, '', \Drupal::request()->request->get('mobile')['image']); 
      $mobile_base64 = base64_decode($data);
      $mobile_screenshot = imagecreatefromstring($mobile_base64);
      imagecopyresampled($image, $mobile_screenshot, 469, 232, 0, 0, 120, 180, 375, 563);
      $mobile_icon = imagecreatefrompng(drupal_get_path('module', 'screenshot') . '/images/mobile.png');
      imagecopyresampled($image, $mobile_icon, 458, 210, 0, 0, 142, 240, 1418, 2400);
    }
    else {
      throw new BadRequestHttpException();
    }
    imagesavealpha($image, TRUE);
    $saveFile = 'temporary://ubg-screenshot-' . time() . '-' . mt_rand(1000, 9999) . '.png';
    imagepng($image, $saveFile);
    $response = new StreamedResponse(function() use ($saveFile) {
       echo file_get_contents($saveFile);
       unlink($saveFile);
    });
    $response->headers->set('Content-Type', 'image/png');
    $response->headers->set('Content-Disposition', 'attachment;filename=screenshot.png');
    return $response;
  }
  
}
