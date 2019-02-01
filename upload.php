<?php
ini_set('upload_max_filesize', '2M');
header('Content-Type: application/json');
$file = $_FILES['file'];

$ret = [];

if(move_uploaded_file($file['tmp_name'],'uploads/'.$file['name'])){
    $ret["status"] = "success";
    $ret["path"] = 'uploads/'. $file['name'];
    $ret["name"] = $file['name'];
}else{
    $ret["status"] = "error";
    $ret["name"] = $file['name'];
}

echo json_encode($ret, JSON_PRETTY_PRINT);
?>