<?php
    header("Content-Type: text/html; charset=UTF-8");
?>
<!DOCTYPE html>
<html>
  <head>
    <title>ストリーム速報γ</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script type="text/javascript">
      var server = '192.168.11.7';
      var port = 3000;
    </script>
    <script src="/js/client.js"></script>
    <script src="http://192.168.11.7:3000/socket.io/socket.io.js"></script>
  </head>
  <body>
<?php
    $jsonData = file_get_contents('/var/www/test/json/sample.json');
    $objJson = json_decode( $jsonData );
?>
    <ul id="output">
<?php
    foreach( $objJson->item as $item ){
        echo sprintf( '<li class="%d">%s（%d円）</li>', intval( $item->itemCode ), strval( $item->itemName ), intval( $item->itemPrice ) );
    }
?>
    </ul>
  </body>
</html>
