<?php
declare(strict_types=1);

/*
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Key;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\ValidationData;
*/

use Lcobucci\JWT\Encoding\ChainedFormatter;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Token\Builder;
// for validation
use Lcobucci\JWT\Token\Parser;
use Lcobucci\JWT\Validation\Validator;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\JWT\Validation\Constraint\IdentifiedBy;
use Lcobucci\JWT\Validation\Constraint\LooseValidAt;
use Lcobucci\JWT\Encoding\CannotDecodeContent;
use Lcobucci\JWT\Token\InvalidTokenStructure;
use Lcobucci\JWT\Token\UnsupportedHeaderFound;
use Lcobucci\JWT\UnencryptedToken;
use Lcobucci\Clock\SystemClock;
//
require 'vendor/autoload.php';


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

$tokenBuilder = (new Builder(new JoseEncoder(), ChainedFormatter::default()));
$algorithm    = new Sha256();
$verifyKey = InMemory::plainText($privateKey);
$signKey = InMemory::plainText($publicKey);
/*
public static function forAsymmetricSigner(
        Signer $signer,
        Key $signingKey,
        Key $verificationKey,
        ?Encoder $encoder = null,
        ?Decoder $decoder = null
*/

$now   = new DateTimeImmutable();
$token = $tokenBuilder
  // Configures the issuer (iss claim)
  ->issuedBy('https://daten.cafe')
  // Configures the audience (aud claim)
  ->permittedFor('https://daten.cafe')
  // Configures the id (jti claim)
  ->identifiedBy("123")
  // Configures the time that the token was issue (iat claim)
  ->issuedAt($now)
  // Configures the time that the token can be used (nbf claim)
  ->canOnlyBeUsedAfter($now)
  // Configures the expiration time of the token (exp claim)
  ->expiresAt($now->modify('+1 hour'))
  // Configures a new claim, called "uid"
  ->withClaim('uid', "xyz")
  // Configures a new header, called "foo"
  //->withHeader('foo', 'bar')
  // Builds a new token
  //->getToken($algorithm, $signingKey, $verifyKey);
  ->getToken($algorithm, $signKey,$verifyKey);

$tokStr = $token->toString();
echo (PHP_EOL . $tokStr . PHP_EOL);

// ----------

$parser = new Parser(new JoseEncoder());
$tok = $parser->parse($tokStr);
echo("tok:" . $tok->toString() . PHP_EOL);

// ---------

// parse
$uid =$tok->claims()->get('uid'); 
echo ( "uid: ". $uid . PHP_EOL);

// ---------

// Create a key object from the public key
$check = InMemory::plainText($publicKey);

// Verify the signature using the SHA-256 algorithm and the public key
$validator = new Validator();
$algorithm    = new Sha256();

$isValid = $validator->validate($tok, new SignedWith($algorithm,$check));
if ($isValid) 
	echo ("Token Valid" . PHP_EOL);
else {
	echo ("Token Not Valid" . PHP_EOL);
	die();
}


$clock = new SystemClock(new DateTimeZone(date_default_timezone_get()));
if (! $validator->validate($tok, new LooseValidAt($clock))) {
  http_response_code(401);
  echo json_encode(array("error" => "Invalid username or password"));
  die();
}
echo ("Valid AT OK" . PHP_EOL);



?>

