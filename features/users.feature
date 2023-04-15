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

  Scenario: Sign Up
    Given user with email "signup@domain.com" not exist
    When I send a POST request to "/api/signup" with json body:
      | displayName | New User          |
      | email       | signup@domain.com |
      | password    | plainPassword     |
    Then the JSON node "displayName" should be equal to "New User"
    Then the JSON node "email" should be equal to "signup@domain.com"
    Then the JSON node "roles[0]" should be equal to "ROLE_USER"

  Scenario: Sign Up with already existent email return an error
    Given user with email "example@domain.com" exist
    When I send a POST request to "/api/signup" with json body:
      | displayName | New User           |
      | email       | example@domain.com |
      | password    | randomPassword     |
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "Email is already registered"