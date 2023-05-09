<?php

/**
 * Simple send & receive client for test purpose.
 * Run in console: php examples/send.php <options> <message>
 *
 * Console options:
 *  --uri <uri> : The URI to connect to, default ws://localhost:8000
 *  --opcode <string> : Opcode to send, default 'text'
 *  --debug : Output log data (if logger is available)
 */

namespace WebSocket;

require __DIR__ . '/vendor/autoload.php';

echo "> Send client\n";

// Server options specified or random
$url = 'ws://localhost:9000';
$data = array("val1" => 123,"val2" => -.5,"id"=> "sensor1");
$message = json_encode(array(
    "action"=>"publish",
    "topic" => "top",
    "id"=>"id1",
    "device"=>"123",
    "payload" => json_encode($data)
    )
);

try {
    // Create client, send and recevie
    $client = new Client($url);
    $client->send($message);
    $client->close();
    echo "> Closing client\n";
} catch (\Throwable $e) {
    echo "ERROR: {$e->getMessage()} [{$e->getCode()}]\n";
}
