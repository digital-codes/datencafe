<?php
declare(strict_types=1);

// Set the allowed origin and allowed methods

header("Access-Control-Allow-Headers: *");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');


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

//

require 'vendor/autoload.php';


// Define the jti claim for JWT
$jti_claim = "Ureiz5Koqua8ied5ook0";

function parseToken($token)
{
    checkToken($token);
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

function checkToken($token)
{
    global $jti_claim;
    $parser = new Parser(new JoseEncoder());
    $tok = $parser->parse($token);
    //echo("tok:" . $tok->toString() . PHP_EOL);
    $validator = new Validator();

    if (! $validator->validate($tok, new IdentifiedBy($jti_claim))) {
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
$url = $_GET['url'];
if (isset($_GET["type"])) {
    $type = $_GET['type'];
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

// Set the content type header for the response
switch ($type) {
    case "json":
        header("Content-type: application/json");
        break;
    case "xls":
        header("Content-type: application/binary");
        break;
    case "csv":
        header("Content-type: text/csv");
        break;
    default:
        header("Content-type: text/csv");
        break;
}
/*
if ($type == "csv") {
    header("Content-type: text/csv");
} else {
    header("Content-type: application/json");
}
*/
// select 1 of 2 modes
$fetchMode = 1;

if ($fetchMode == 1) {
    // Fetch the content from the URL using cURL
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $content = curl_exec($ch);
    curl_close($ch);
    // Output the content
    // header('Content-Type: text/plain');
    echo $content;
} else {
    // Get the contents of the URL and output it
    echo file_get_contents($url);
}


?>



