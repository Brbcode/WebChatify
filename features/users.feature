Feature:
  In order to prove that the User api works correctly
  As a user
  I want to be able

  Scenario: User successful login
    When I send a POST request to "/api/login" with json body:
      | email    | example@domain.com |
      | password | plainPassword      |
    Then the JSON node "token" should exist

  Scenario: User login with bad credentials
    When I send a POST request to "/api/login" with json body:
      | email    | example@domain.com |
      | password | plainPasswordasd   |
    Then the response status code should be 401
    And the JSON node "code" should be equal to 401
    And the JSON node "message" should be equal to "Invalid credentials."