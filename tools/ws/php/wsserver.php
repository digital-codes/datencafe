<?php

namespace WebSocket;

require __DIR__ . '/vendor/autoload.php';
/*
require 'vendor/autoload.php';

use Textalk\Websocket\Server;
*/

class PubSub
{
    private $clients = [];
    private $subscriptions = [];

    public function subscribe($conn, $topic, $appId, $device)
    {
        echo "Subscribe to " . $topic . " " . $appId . " " . $device . " " . count($this->clients) . " " . count($this->subscriptions) . "\n";
        $this->clients[$conn->getId()] = $conn;

        if (array_key_exists($topic, $this->subscriptions)) {
            echo "Existing topic " . $topic . " " . count($this->subscriptions[$topic]) . "\n";
            $this->subscriptions[$topic][$conn->getId()] = $conn;
        } else {
            echo "Adding topic " . $topic . "\n";
            $this->subscriptions[$topic] = [$conn->getId() => $conn];
        }
    }

    public function unsubscribe($conn, $topic, $appId)
    {
        echo "subscriptions: " . count($this->subscriptions) . "\n";

        if (array_key_exists($conn->getId(), $this->clients)) {
            unset($this->clients[$conn->getId()]);
        }

        if (array_key_exists($topic, $this->subscriptions)) {
            if (array_key_exists($conn->getId(), $this->subscriptions[$topic])) {
                unset($this->subscriptions[$topic][$conn->getId()]);
            }
        }
    }

    public function publish($topic, $message)
    {
        echo "Publish to: " . $topic . "\n";
        try {
            $data = json_decode($message, true);
            echo "Json Data:\n";
            print_r($data);
        } catch (Exception $e) {
            $data = $message;
            echo "Text Data: " . $data . "\n";
        }

        if (array_key_exists($topic, $this->subscriptions)) {
            echo "topic ok\n";
            foreach ($this->subscriptions[$topic] as $client) {
                echo "return message: " . $message . "\n";
                $client->send($message);
            }
        }
    }
}

$pubsub = new PubSub();
/*
$server = new Server('0.0.0.0', 9000, function ($conn) use ($pubsub) {
    echo "handle\n";
    $client_ip = $conn->getRemoteAddress();
    echo "Received message from " . $client_ip . "\n";
    $pubsub->subscribe($conn, '', '', '');

    while ($msg = $conn->receive()) {
        $data = json_decode($msg, true);
        $action = $data['action'];
        $topic = $data['topic'];

        echo "Data: ";
        print_r($data);
        echo "Action: " . $action . "\n";
        echo "Topic: " . $topic . "\n";

        if ($action === 'subscribe') {
            $appId = $data["id"];
            $device = $data["device"];
            $pubsub->subscribe($conn, $topic, $appId, $device);
        } elseif ($action === 'unsubscribe') {
            $appId = $data["id"];
            $pubsub->unsubscribe($conn, $topic, $appId);
        } elseif ($action === 'publish') {
            $payload = $data["payload"];
            echo "Payload: " . $payload . "\n";
            $pubsub->publish($topic, $payload);
        }
    }
    echo "Cleaning up\n";
    $pubsub->unsubscribe($conn, '', '');
});
*/
$server = new Server([
    'port' => 9000,
    'host' => "localhost", //'0.0.0.0',
  ]);

$server->on('connection', function ($conn) use ($pubsub) {
    echo "New connection\n";
    $pubsub->subscribe($conn, '', '', '');

    $conn->on('message', function ($msg) use ($conn, $pubsub) {
        $data = json_decode($msg, true);
        $action = $data['action'];
        $topic = $data['topic'];

        echo "Data: ";
        print_r($data);
        echo "Action: " . $action . "\n";
        echo "Topic: " . $topic . "\n";

        if ($action === 'subscribe') {
            $appId = $data["id"];
            $device = $data["device"];
            $pubsub->subscribe($conn, $topic, $appId, $device);
        } elseif ($action === 'unsubscribe') {
            $appId = $data["id"];
            $pubsub->unsubscribe($conn, $topic, $appId);
        } elseif ($action === 'publish') {
            $payload = $data["payload"];
            echo "Payload: " . $payload . "\n";
            $pubsub->publish($topic, $payload);
        }
    });

    $conn->on('close', function () use ($conn, $pubsub) {
        echo "Connection closed\n";
        $pubsub->unsubscribe($conn, '', '');
    });
});

$server->run();
