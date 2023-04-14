<?php

declare(strict_types=1);

namespace App\Tests\Behat;

use Behatch\Context\BaseContext;
use Behatch\HttpCall\Request;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;
use Symfony\Component\HttpFoundation\Request as HttpRequest;

class RestContext extends BaseContext
{
    private Request\BrowserKit|Request\Goutte|Request $request;
    protected ?string $token = null;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * @When I send a :method request to :url with json body:
     */
    public function iSendARequestToWithJsonBody(string $method, string $url, PyStringNode|TableNode $body)
    {
        $rawBody = static::getRawJsonBody($body);

        $this->request->setHttpHeader("Content-Type", "application/json");
        return $this->request->send(
            $method,
            $this->locatePath($url),
            [],
            [],
            $rawBody
        );
    }

    private static function isJson(String $string)
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }

    private static function getRawJsonBody(PyStringNode|TableNode $body): string
    {
        if ($body instanceof PyStringNode) {
            if (!static::isJson($body->getRaw())) {
                throw new \Exception("Body is not a valid json");
            }
            return  $body->getRaw();
        } else {
            $rows = $body->getRows();
            if (count($rows[0])!==2) {
                throw new \Exception("Invalid table format");
            }

            return json_encode($body->getRowsHash());
        }
    }

    //@Given /^I am logged with "([^"]*)" and "([^"]*)"$/

    /**
     * @Given I am logged with :email and :password
     */
    public function iAmLoggedWithAnd(string $email, string $plainPassword)
    {

        $rawBody = json_encode([
           'email' => $email,
           'password' => $plainPassword
        ]);

        $this->request->setHttpHeader("Content-Type", "application/json");
        $response = $this->request->send(
            HttpRequest::METHOD_GET,
            $this->locatePath('/api/login'),
            [],
            [],
            $rawBody
        );

        $json = json_decode($response->getContent());
        if (!isset($json->token)) {
            throw new \Exception("Invalid login response");
        }
        $this->token = $json->token;
    }

    /**
     * @When user send a :method request to :url
     */
    public function userSendAGETRequestTo(string $method, string $url)
    {
        if (null === $this->token) {
            throw new \Exception("User is not logged");
        }

        $this->request->setHttpHeader("Authorization", "Bearer $this->token");
        return $this->request->send(
            $method,
            $this->locatePath($url)
        );
    }
}
