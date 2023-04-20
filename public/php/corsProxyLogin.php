<?php

declare(strict_types=1);

header("Access-Control-Allow-Headers: *");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

use Lcobucci\JWT\Encoding\ChainedFormatter;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Token\Builder;

// for validation
use Lcobucci\JWT\Token\Parser;
use Lcobucci\JWT\Validation\Validator;
use Lcobucci\JWT\Validation\Constraint\IdentifiedBy;
use Lcobucci\JWT\Validation\Constraint\LooseValidAt;
use Lcobucci\JWT\Encoding\CannotDecodeContent;
use Lcobucci\JWT\Token\InvalidTokenStructure;
use Lcobucci\JWT\Token\UnsupportedHeaderFound;
use Lcobucci\JWT\UnencryptedToken;
use Lcobucci\Clock\SystemClock;
//

require 'vendor/autoload.php';

// cors proxy login
// Define the CSV file path
// $csv_file = 'users.csv';
// on localhost we just force a token
$csv_file = "/home/akugel/files/datencafe/users.csv";

// Define the jti claim for JWT
$jti_claim = "Ureiz5Koqua8ied5ook0";


function sanitizeUsername($username) {
  $username = filter_var($username, FILTER_SANITIZE_STRING);
  $username = trim($username);
  return $username;
}

function sanitizePassword($password) {
  $password = filter_var($password, FILTER_SANITIZE_STRING);
  $password = trim($password);
  return $password;
}

function extractUsernameAndPassword() {
    $username = '';
    $password = '';
  
    // Check if the request method is POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      // Get the raw POST data
      $postData = file_get_contents('php://input');
      $params = json_decode($postData, true);

      // Extract the username and password from the parameters
      if (isset($params['username']) && isset($params['password'])) {
        $username = $params['username'];
        $password = $params['password'];
      }
    }
  
    return array('username' => $username, 'password' => $password);
  }

function parseToken($token) {
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

function checkToken($token) {
  global $jti_claim;
  $parser = new Parser(new JoseEncoder());
  $tok = $parser->parse($token);
  echo("tok:" . $tok->toString() . PHP_EOL);
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

// https://lcobucci-jwt.readthedocs.io/en/4.3.0/issuing-tokens/  
function makeToken($username) {
  global $secret_key;
  global $jti_claim;
  
  $tokenBuilder = (new Builder(new JoseEncoder(), ChainedFormatter::default()));
  $algorithm    = new Sha256();
  $signingKey   = InMemory::plainText(random_bytes(32));
  
  $now   = new DateTimeImmutable();
  $token = $tokenBuilder
      // Configures the issuer (iss claim)
      ->issuedBy('https://daten.cafe')
      // Configures the audience (aud claim)
      ->permittedFor('https://daten.cafe')
      // Configures the id (jti claim)
      ->identifiedBy($jti_claim)
      // Configures the time that the token was issue (iat claim)
      ->issuedAt($now)
      // Configures the time that the token can be used (nbf claim)
      ->canOnlyBeUsedAfter($now)
      // Configures the expiration time of the token (exp claim)
      ->expiresAt($now->modify('+4 hour'))
      // Configures a new claim, called "uid"
      ->withClaim('uid', $username)
      // Configures a new header, called "foo"
      //->withHeader('foo', 'bar')
      // Builds a new token
      ->getToken($algorithm, $signingKey);
  
  return $token->toString();
}

function login() {
    global $csv_file, $secret_key, $token_exp_time;
    // check if we are running on localhost. forced login then
    if (($_SERVER['SERVER_NAME'] === 'localhost') || ($_SERVER['REMOTE_ADDR'] === '127.0.0.1')) {
      $token = makeToken("LOCALHOST"); //JWT::encode($payload, $secret_key);
      echo json_encode(array("token" => $token));
      return;
    }
    

    // Extract the username and password from the request
    $params = extractUsernameAndPassword();
    $username = $params['username'];
    $password = $params['password'];
    
    // Check if the username and password are provided
    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(array("error" => "Missing username or password"));
        return;
    }
    
    // Sanitize the inputs
    $username = sanitizeUsername($username);
    $password = sanitizePassword($password);
    
    // Check if the CSV file exists
    if (!file_exists($csv_file)) {
        http_response_code(500);
        echo json_encode(array("error" => "Internal server error"));
        return;
    }
    
    // Open the CSV file for reading
    if (($handle = fopen($csv_file, "r")) !== FALSE) {
        // Loop through the CSV rows
        while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
        // Check if the username and password match
        // password must behashed like so:
        // $hashed_pwd = ( password_hash($the_password, PASSWORD_DEFAULT ));
        // and verified like so
        // password_verify(user_input,$hashed_pwd);
        // true if OK
        if ($data[0] === $username && password_verify($password, $data[1])) {
        //  if ($data[0] === $username && ($password === $data[1])) {
            $token = makeToken($username); //JWT::encode($payload, $secret_key);
            echo json_encode(array("token" => $token));
            return;
        }
        }
        fclose($handle);
    }
    
    // If we reach this point, the username or password is invalid
    http_response_code(401);
    echo json_encode(array("error" => "Invalid username or password"));
    }

    login();


?>



