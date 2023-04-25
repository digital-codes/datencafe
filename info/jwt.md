Yes, you can also use the jose library to both decode and verify a JWT token in JavaScript.

Here's an example of how to use jose to decode a JWT token and access its claims:

javascript

const {JWT} = require('jose');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const decodedToken = JWT.decode(token);
console.log(decodedToken);

This will output the decoded token as a JavaScript object, including the claims in the payload.

To verify the token without the secret, you can use the JWT.verify method with the ignoreExpiration option set to true to only check the token signature:

javascript

const {JWT} = require('jose');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const isValid = JWT.verify(token, null, {ignoreExpiration: true});
console.log(isValid);

This will output true if the token is valid, and false otherwise. Note that this method only checks that the token has not been tampered with, but does not check the validity of the claims themselves. If you want to also check the claims, you can add additional options to the verify method, such as the audience or issuer options.
andreas.kugel@ok-lab-karlsruhe.de
does not work without secret

You are correct. Without the secret, the JWT.verify method of the jose library cannot verify the signature and the token will not be validated. In order to validate the token, you need the secret or public key that was used to sign the token.

Here's an example of how to verify a JWT token with jose library using a secret:

javascript

const {JWT} = require('jose');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const secret = 'my_secret_key';

const isValid = JWT.verify(token, secret);
console.log(isValid);

This will output true if the token is valid, and false otherwise.

If you do not have the secret or public key, you cannot validate the token. In that case, you should obtain the secret or public key from the issuer of the token or through some other trusted means.
andreas.kugel@ok-lab-karlsruhe.de
create a publich key with jose on php and verify with jose on javascript

To create a public key with jose on PHP, you can use the web-token/jwt-key-mgmt package. Here's an example:

php

use Jose\Component\Core\JWK;
use Jose\Component\KeyManagement\JWKFactory;

// Generate a new RSA key pair
$jwk = JWKFactory::createRSAKey([
    'size' => 2048,
]);

// Output the public key as a JSON Web Key (JWK)
$publicKey = $jwk->toPublic();
echo $publicKey->toJSON();

This will output the public key in JWK format as a JSON string.

To verify a JWT token with jose on JavaScript using the public key created above, you can use the jose library in the following way:

javascript

const {JWT, JWK} = require('jose');
const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.NjvFXY1hVZfI6Q2X9dPvsn8JzIMw0NpqPzV7BRu06vN8V0A1Fpehe2VZxhGvZe8NV7aH6c5U5e1U6FNN2JoK4rxO4zsD9XzU-wvO8W7IJr92r1F02CEcLpR69-1nCQh6rn8U6ykxU6lNcgeOfX9-kNlUovL1NnqbLl0EVU2w6U';

// Parse the JWK public key from the JSON string
const publicKey = JWK.asKey({
    'kty': 'RSA',
    'n': 'qB3pBOg...',
    'e': 'AQAB'
});

// Verify the JWT token using the public key
const isValid = JWT.verify(token, publicKey);
console.log(isValid);

This will output true if the token is valid, and false otherwise. Note that in this example, the public key is hardcoded as a JSON object, but in practice, you would obtain the public key from the issuer of the token or through some other trusted means.
andreas.kugel@ok-lab-karlsruhe.de
on  jose php how to create the token using the public key method

To create a JWT token using a public key to sign it in PHP with jose, you can use the web-token/jwt-signature package. Here's an example:

php

use Jose\Component\Core\AlgorithmManager;
use Jose\Component\Signature\Algorithm\RS256;
use Jose\Component\Signature\JWSBuilder;
use Jose\Component\Signature\Serializer\CompactSerializer;
use Jose\Component\Signature\Serializer\JWSSerializerManager;
use Jose\Component\Signature\JWSVerifier;
use Jose\Component\Core\JWK;
use Jose\Component\KeyManagement\JWKFactory;

// Generate a new RSA key pair
$jwk = JWKFactory::createRSAKey([
    'size' => 2048,
]);

// Create the JWS builder and serializer
$algorithmManager = AlgorithmManager::create([
    new RS256(),
]);
$jwsBuilder = new JWSBuilder($algorithmManager);
$jwsSerializerManager = new JWSSerializerManager([
    new CompactSerializer(),
]);

// Define the payload
$payload = [
    'sub' => '1234567890',
    'name' => 'John Doe',
    'iat' => time(),
    'exp' => time() + 3600,
];

// Sign the token using the private key
$jws = $jwsBuilder->create()
    ->withPayload(json_encode($payload))
    ->addSignature($jwk, [
        'alg' => 'RS256',
    ])
    ->build();

// Serialize the token
$serializer = $jwsSerializerManager->get('compact');
$token = $serializer->serialize($jws);

// Output the token
echo $token;

This will output the JWT token signed with the private key in Compact Serialization format.

Note that in the example above, we are signing the token with a private key, but to verify it on the JavaScript side, we will use the corresponding public key. The public key can be obtained by converting the private key to a public key using the toPublic() method of the JWK object:

php

// Convert the private key to a public key
$publicKey = $jwk->toPublic();

Then, you can pass this public key to the JavaScript code to verify the token as shown in the previous example.




------
To create a public key and sign a JWT token using the lcobucci/JWT library in PHP, you can use the following code:

php

use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Key;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\ValidationData;

// Generate a new RSA key pair
$key = openssl_pkey_new([
    'digest_alg' => 'sha256',
    'private_key_bits' => 2048,
    'private_key_type' => OPENSSL_KEYTYPE_RSA,
]);

// Extract the private and public keys in PEM format
openssl_pkey_export($key, $privateKey);
$publicKey = openssl_pkey_get_details($key)['key'];

// Build the token with the private key
$builder = new Builder();
$builder->issuedBy('http://example.com')
        ->permittedFor('http://example.org')
        ->identifiedBy('4f1g23a12aa', true)
        ->issuedAt(time())
        ->expiresAt(time() + 3600)
        ->withClaim('sub', '1234567890')
        ->withClaim('name', 'John Doe')
        ->sign(new Sha256(), new Key($privateKey));

// Serialize the token to a string
$token = $builder->getToken();

// Output the token
echo $token;

// Verify the token with the public key
$parser = new Parser();
$jwt = $parser->parse($token);

$validationData = new ValidationData();
$validationData->setIssuer('http://example.com');
$validationData->setAudience('http://example.org');
$validationData->setId('4f1g23a12aa');

$publicKey = new Key($publicKey);
$isVerified = $jwt->verify(new Sha256(), $publicKey);
$isValid = $jwt->validate($validationData);

echo "Is verified: " . ($isVerified ? "true" : "false") . "\n";
echo "Is valid: " . ($isValid ? "true" : "false") . "\n";

In this example, we use the openssl_pkey_new() function to generate an RSA key pair, and then extract the private and public keys in PEM format. We then use the Builder class to create a JWT token with some claims, and sign it using the private key and the Sha256 signer.

To verify the token, we use the Parser class to parse the token string, and then create a ValidationData object to specify the expected issuer, audience, and ID. We also create a Key object from the public key and use it to verify the signature and validate the token.

Note that in practice, you would typically obtain the public key from the issuer of the token or through some other trusted means, rather than generating it on the same server as the private key.

----------
lcobucci 4.3
https://lcobucci-jwt.readthedocs.io/en/4.3.0/configuration/

