<?php

// namespace App;

// use ReallySimpleJWT\Token;
// use Symfony\Component\HttpFoundation\JsonResponse;

// function isTokenAdmin($data)
// {
//     if (Token::validate($data, $_ENV["APP_SECRET"])) {
//         $dataInToken = Token::getPayload($data, $_ENV["APP_SECRET"]);
//         if ($dataInToken['user_id']['user'] != 'admin') {
//             return true;
//         }
//     }
//     return false;
// }
