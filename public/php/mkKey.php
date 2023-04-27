<?php
declare(strict_types=1);


// Generate a new RSA key pair
$key = openssl_pkey_new([
    'digest_alg' => 'sha256',
    'private_key_bits' => 2048,
    'private_key_type' => OPENSSL_KEYTYPE_RSA,
]);

// Extract the private and public keys in PEM format
openssl_pkey_export($key, $privateKey);
$publicKey = openssl_pkey_get_details($key)['key'];
echo( "Public:" . $publicKey . PHP_EOL);
echo( "Private:" . $privateKey . PHP_EOL);

$pr = "private.pem";
$pu = "public.pem";
file_put_contents($pr,$privateKey);
file_put_contents($pu,$publicKey);

echo("Files created: " . $pr . ", " . $pu . PHP_EOL);


?>

