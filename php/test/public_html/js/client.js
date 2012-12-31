$(document).ready(function() {
    var socket = io.connect('http://'+ server +':'+ port);

    socket.on('connect', function() {
        console.log('connect');
    });

    socket.on('disconnect', function(){
        console.log('disconnect');
    });

    socket.on('change', function(log) {
        json_data = log;
        
        parse_json = $.parseJSON(json_data);

        jQuery.each( parse_json.item, function(index){
            var code = parse_json.item[index].itemCode;
            var name = parse_json.item[index].itemName;
            var price = parse_json.item[index].itemPrice;
            $("ul#output>li." + code).text(name + "（" + price + "円）");
        });
    });
});
