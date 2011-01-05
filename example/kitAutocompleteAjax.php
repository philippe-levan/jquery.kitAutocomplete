<?php
$term = $_POST["term"];
$field = $_POST["field"];
$tab = array(
    array("id"=>12, "value"=>"France", "extra"=> "tititatat", "className"=>"normal"),
    array("id"=>15, "value"=>"Angleterre", "extra" => "tutu", "className"=>"normal"),
    array("id"=>16, "value"=>"Irelande", "extra" => "ir", "className"=>"disabled"),
    array("id"=>17, "value"=>"Allemagne", "extra" => "de", "className"=>"normal"),
    array("id"=>18, "value"=>"Autriche", "extra" => "de", "className"=>"disabled"),
    array("id"=>19, "value"=>"Luxembourg", "extra" => "de", "className"=>"normal"),
    array("id"=>20, "value"=>"Russie", "extra" => "de", "className"=>"normal"),
    array("id"=>21, "value"=>"Japon", "extra" => "jp", "className"=>"normal")
);

$filterTab = array();
foreach ($tab as $pays) {
    if (strpos(strtolower($pays[$field]), strtolower($term)) !== false) {
        $filterTab[] = $pays;
    }
}


echo json_encode($filterTab);
?>
