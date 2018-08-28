<?php
error_reporting(0);
header('Content-type: application/json');
require_once 'database.php';
$data = array();
if ($_GET['source'] == 'dict') {
	$sql = "SELECT * FROM dict ORDER BY convert(spell using gbk) ASC";
	$res = mysqli_query($link, $sql);
	while ($row = mysqli_fetch_assoc($res)) {
		$data[] = $row;
	}
} elseif ($_GET['source'] == 'sents') {
	$sql = "SELECT * FROM sents";
	$res = mysqli_query($link, $sql);
	while ($row = mysqli_fetch_assoc($res)) {
		$data[] = $row;
	}
} elseif ($_GET['source'] == 'daily') {
	$sql = "SELECT * FROM daily ORDER BY date DESC";
	$res = mysqli_query($link, $sql);
	while ($row = mysqli_fetch_assoc($res)) {
		$data[] = $row;
	}
} elseif ($_GET['source'] == 'video') {
	$sql = "SELECT * FROM video ORDER BY date DESC";
	$res = mysqli_query($link, $sql);
	while ($row = mysqli_fetch_assoc($res)) {
		$data[] = $row;
	}
} elseif ($_GET['source'] == 'category') {
	$sql = "SELECT * FROM categories ORDER BY convert(name using gbk) ASC";
	$res = mysqli_query($link, $sql);
	while ($row = mysqli_fetch_assoc($res)) {
		$data[] = $row['name'];
	}
} elseif ($_GET['source'] == 'types') {
	$sql = "SELECT * FROM types ORDER BY convert(name using gbk) ASC";
	$res = mysqli_query($link, $sql);
	while ($row = mysqli_fetch_assoc($res)) {
		$data[] = $row;
	}
}
mysqli_free_result($res);
mysqli_close($link);
echo json_encode($data);
exit;