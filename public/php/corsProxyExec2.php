<?php
declare(strict_types=1);

// Set the allowed origin and allowed methods

header("Access-Control-Allow-Headers: *");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');


// for validation
use Lcobucci\JWT\Token\Parser;
use Lcobucci\JWT\Validation\Validator;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Validation\Constraint\IdentifiedBy;
use Lcobucci\JWT\Validation\Constraint\LooseValidAt;
use Lcobucci\JWT\Encoding\CannotDecodeContent;
use Lcobucci\JWT\Token\InvalidTokenStructure;
use Lcobucci\JWT\Token\UnsupportedHeaderFound;
use Lcobucci\JWT\UnencryptedToken;
use Lcobucci\Clock\SystemClock;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Lcobucci\JWT\Validation\Constraint\SignedWith;

//

require 'vendor/autoload.php';


// Define the jti claim for JWT
$jti_claim = "Ureiz5Koqua8ied5ook0";

$public_file = "/home/akugel/files/datencafe/public.pem";
if (($_SERVER === null) || ($_SERVER['SERVER_NAME'] === 'localhost') || ($_SERVER['REMOTE_ADDR'] === '127.0.0.1')) {
    $public_file = "./public.pem";
}
$publicKey = file_get_contents($public_file);

function parseToken($token)
{
    global $publicKey;
    checkToken($token,$publicKey); // throws on error here 
    $parser = new Parser(new JoseEncoder());

    try {
        $tok = $parser->parse($token);
    } catch (CannotDecodeContent | InvalidTokenStructure | UnsupportedHeaderFound $e) {
        http_response_code(401);
        echo json_encode(array("error" => "Invalid username or password"));
        die();
    }
    assert($tok instanceof UnencryptedToken);
    $user = $tok->claims()->get('uid');
    //echo("User: " . $user . PHP_EOL);
    return $user;
}

function checkToken($token,$publicKey) {
    global $jti_claim;
    $parser = new Parser(new JoseEncoder());
    $tok = $parser->parse($token);
  
    // Create a key object from the public key
    $check = InMemory::plainText($publicKey);
  
    // Verify the signature using the SHA-256 algorithm and the public key
    $validator = new Validator();
    $algorithm    = new Sha256();
  
    if (! $validator->validate($tok,  new SignedWith($algorithm,$check))) {
        http_response_code(401);
        echo json_encode(array("error" => "Invalid username or password"));
        die();
    }
  
    $clock = new SystemClock(new DateTimeZone(date_default_timezone_get()));
    if (! $validator->validate($tok, new LooseValidAt($clock))) {
        http_response_code(401);
        echo json_encode(array("error" => "Invalid username or password"));
        die();
    }
  }
  

function sanitizeUrl($url)
{
    $url = filter_var($url, FILTER_SANITIZE_URL);
    return $url;
}

// Check the request method
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle pre-flight OPTIONS requests
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
    exit();
}

// Check if the request has an Authorization header
if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
    http_response_code(401);
    exit('Unauthorized');
}

// Get the token from the Authorization header
$token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);

// Verify the token and get the user ID
try {
    $user_id = parseToken($token);
} catch (Exception $e) {
    http_response_code(401);
    exit('Unauthorized');
}

// Get the URL to proxy from the query string
// Get the raw HTTP request body
$body = file_get_contents('php://input');

// Parse the body according to the content type
$content_type = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
if (strpos($content_type, 'application/json') === false) {
    http_response_code(400);
    exit('Invalid Request1');
}
// Parse the body as JSON
$data = json_decode($body);
if (!isset($data->url)) {
    http_response_code(400);
    exit('Invalid Request2');
} else {
    $url = $data->url;
}

if (isset($data->type)) {
    $type = $data->type;
} else {
    $type = "json";
}

// Make sure the URL is valid
if (filter_var($url, FILTER_VALIDATE_URL) === false) {
    http_response_code(400);
    exit('Invalid URL');
}

// Get the content type of the requested resource
//$mime_type = mime_content_type($url);

// select 1 of 2 modes
$fetchMode = 2;

// get file, we need to save the file anyway ...
if ($fetchMode == 2) {
    // Fetch the content from the URL using cURL
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $content = curl_exec($ch);
    curl_close($ch);
    // Output the content
    // header('Content-Type: text/plain');
} else {
    // Get the contents of the URL and output it
    $content = curl_exec($ch);
}
// save
$tmpfile = tempnam(".", "CORS");
file_put_contents($tmpfile,$content);
// detect type
$mime_type = mime_content_type($tmpfile);
// set header
header("Content-type: " . $mime_type);
echo file_get_contents($tmpfile);
// remove file
unlink($tmpfile);

?>



