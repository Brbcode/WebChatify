<?php

declare(strict_types=1);

namespace App\Tests\Behat;

use Behat\Behat\Hook\Scope\BeforeScenarioScope;
use Behat\Behat\Tester\Exception\PendingException;
use Behatch\Context\BaseContext;
use Behatch\Context\JsonContext;
use Behatch\HttpCall\HttpCallResultPool;
use Behatch\Json\Json;
use Behatch\Json\JsonInspector;

class JsonExtensionContext extends BaseContext
{
    private HttpCallResultPool $httpCallResultPool;
    private JsonInspector $inspector;

    /**
     * @BeforeScenario
     * @Thanks https://github.com/FriendsOfBehat/SymfonyExtension/issues/111#issuecomment-652328411
     */
    public function beforeScenario(BeforeScenarioScope $scope)
    {
        $jsonContext = $scope->getEnvironment()->getContext(JsonContext::class);
        $refl = new \ReflectionClass(JsonContext::class);

        $httpCallResultPoolProperty = $refl->getProperty('httpCallResultPool');
        $inspectorProperty = $refl->getProperty('inspector');

        $httpCallResultPoolProperty->setAccessible(true);
        $inspectorProperty->setAccessible(true);

        $this->httpCallResultPool = $httpCallResultPoolProperty->getValue($jsonContext);
        $this->inspector = $inspectorProperty->getValue($jsonContext);
    }

    /**
     * @throws \JsonException
     */
    protected function getJson(): Json
    {
        return new Json($this->httpCallResultPool->getResult()->getValue());
    }

    /**
     * @Then the JSON node :node should be the current date and time
     */
    public function theJSONNodeShouldBeTheCurrentDateAndTime($node)
    {
        $json = $this->getJson();
        $actual = new \DateTimeImmutable($this->inspector->evaluate($json, $node));
        $now = new \DateTimeImmutable();
        $diff = $actual->diff($now);
        $threshold = new \DateInterval('PT1M');

        $this->assertTrue(
            self::getTotalSeconds($diff) < self::getTotalSeconds($threshold),
            sprintf('Time exceeds actual threshold: %s', self::getIntervalString($threshold)),
        );
    }

    protected static function getTotalSeconds(\DateInterval $interval): int
    {
        $s = 0;
        $s += $interval->y * 365 * 24 * 60 * 60;
        $s += $interval->m * 30 * 24 * 60 * 60;
        $s += $interval->d * 24 * 60 * 60;
        $s += $interval->h * 60 * 60;
        $s += $interval->i * 60;
        $s += $interval->s;

        return $s;
    }

    protected static function getIntervalString(\DateInterval $interval): string
    {
        $values = [];
        if ($interval->y > 0) {
            $values[] = $interval->y . ' years';
        }
        if ($interval->m > 0) {
            $values[] = $interval->m . ' months';
        }
        if ($interval->d > 0) {
            $values[] = $interval->d . ' days';
        }
        if ($interval->h > 0) {
            $values[] = $interval->h . ' hours';
        }
        if ($interval->i > 0) {
            $values[] = $interval->i . ' minutes';
        }
        if ($interval->s > 0) {
            $values[] = $interval->s . ' seconds';
        }

        return implode(', ', $values);
    }
}
