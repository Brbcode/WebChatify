Feature:
  In order to prove that the Api fallback works correctly
  As a user
  I want to be able

  Scenario: Catch invalid requests
    When I send a GET request to "/api/invalid-request"
    Then the response status code should be 404
    Then the JSON node "message" should be equal to "Invalid api endpoint"

  Scenario: Catch invalid request with token
    Given I am logged with "example@domain.com" and "plainPassword"
    When user send a GET request to "/api/invalid-request"
    Then the response status code should be 404
    Then the JSON node "message" should be equal to "Invalid api endpoint"