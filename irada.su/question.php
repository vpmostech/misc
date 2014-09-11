<?php
	// Если кто-то вдруг захочет подписаться на наши новости - нам сообщат на
	$ouraddr = "irada.su@yandex.ru";

	if (!isset($_POST['name']) || 
		!isset($_POST['contact']) || 
		!isset($_POST['url']) ||
		$_POST['name'] == '' ||
		$_POST['contact'] == ''
		) 
	{
		header("HTTP/1.0 404 Not Found");
	    die();
	}
	
	// Ещё для оставления письма
	$subject = "Запрос с сайта " . $_SERVER['HTTP_HOST'];
	$payload = date('d/m/Y G:i:s', time()) . " пришёл вопрос с сайта " . $_SERVER['HTTP_HOST'] . "\n";
	$payload .= "Информация о запросе: \n\n";
	$payload .= "Имя: " . $_POST['name'] . "\n";
	$payload .= "Контакт: " . $_POST['contact'] . "\n\n";
	$payload .= "Cтраница: " . "http://" . $_SERVER['HTTP_HOST'] . $_POST['url'] . "\n\n";
	$payload .= isset($_POST['payload']) ? "Вопрос:\n" . $_POST['payload'] . "\n" : "Клиент попросил связаться с ним.\n"; 

	$additionalHeader = "Content-type: text/plain; charset=utf-8 \r\n";
	
	// Отправляем и докладываем об успешности
	$retval = mail($ouraddr, $subject, $payload, $additionalHeader);
	echo $retval; // Или что-то посложнее?

?>