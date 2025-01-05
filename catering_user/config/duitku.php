<?php

return [
    'merchant_code' => env('DUITKU_MERCHANT_CODE', 'DS21316'),
    'api_key' => env('DUITKU_API_KEY', '5084bab78b9f96a4f4eda53e951c022b'),
    'endpoint' => env('DUITKU_ENDPOINT', 'https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry'),
    'callback_url' => env('DUITKU_CALLBACK_URL', '/api/payments/callback'),
    'return_url' => env('DUITKU_RETURN_URL', '/payments/success'),
];