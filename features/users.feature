Feature:
  In order to prove that the User api works correctly
  As a user
  I want to be able

  Scenario: Admin get all users
    Given I am logged with "testAdmin@domain.com" and "password"
    When user send a GET request to "/api/users"
    Then the response status code should be 200
    And the JSON node "root" should have 12 elements
    And the JSON node "root[0].id" should be equal to "01H0AQ397CFMBVRXDABC1FEHRW"
    And the JSON node "root[0].email" should be equal to "testAdmin@domain.com"
    And the JSON node "root[0].displayName" should be equal to "Admin User"
    And the JSON node "root[0].roles" should have 2 elements
    And the JSON node "root[0].roles[0]" should be equal to "ROLE_ADMIN"
    And the JSON node "root[1].id" should exist
    And the JSON node "root[1].displayName" should exist
    And the JSON node "root[1].email" should not exist
    And the JSON node "root[1].roles" should not exist

  Scenario: Not admin user try get all users
    Given I am logged with "example@domain.com" and "plainPassword"
    When user send a GET request to "/api/users"
    Then the response status code should be 401
    Then the JSON node "code" should be equal to 401
    Then the JSON node "message" should be equal to "Permission denied"

  Scenario: Not logged user try get all users
    When I send a GET request to "/api/users"
    Then the response status code should be 401
    Then the JSON node "code" should be equal to 401
    Then the JSON node "message" should be equal to "Permission denied"

  Scenario: User successful login
    When I send a POST request to "/api/login" with json body:
      | email    | example@domain.com |
      | password | plainPassword      |
    Then the JSON node "token" should exist
    And the JSON node "id" should exist
    And the JSON node "email" should be equal to "example@domain.com"
    And the JSON node "displayName" should be equal to "Basic User"
    And the JSON node "roles" should have 1 element
    And the JSON node "roles[0]" should be equal to "ROLE_USER"

  Scenario: User login with bad credentials
    When I send a POST request to "/api/login" with json body:
      | email    | example@domain.com |
      | password | plainPasswordasd   |
    Then the response status code should be 401
    And the JSON node "code" should be equal to 401
    And the JSON node "message" should be equal to "Email or password are wrong"

  Scenario: Sign Up
    Given user with email "signup@domain.com" not exist
    When I send a POST request to "/api/signup" with json body:
      | displayName | New User          |
      | email       | signup@domain.com |
      | password    | plainPassword     |
    Then the JSON node "id" should exist
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

  Scenario: Sign Up with wrong email return an error
    Given user with email "wrongEmail" not exist
    When I send a POST request to "/api/signup" with json body:
      | displayName | New User           |
      | email       | wrongEmail         |
      | password    | randomPassword     |
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "Email not valid"

  Scenario: Sign Up with too long email return an error
    Given user with email "FJOMRTGGIHYZXNKPYCJUVQLAWSDEBNPVTIQBLRUEAXKZDSCWHNYVOFMAKPXRUJCXNGLQSBVPIEWKDYTOZMGGIHYZXNKPYCJUVQLAWPVTIQBLRUEAXKZVOFZ@gmail.com" not exist
    When I send a POST request to "/api/signup" with json body:
      | displayName | New User           |
      | email       | FJOMRTGGIHYZXNKPYCJUVQLAWSDEBNPVTIQBLRUEAXKZDSCWHNYVOFMAKPXRUJCXNGLQSBVPIEWKDYTOZMGGIHYZXNKPYCJUVQLAWPVTIQBLRUEAXKZVOFZ@gmail.com |
      | password    | randomPassword     |
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "Email not valid"

  Scenario: Sign Up with empty name return an error
    Given user with email "emptyUserName@domain.com" not exist
    When I send a POST request to "/api/signup" with json body:
      | displayName |                          |
      | email       | emptyUserName@domain.com |
      | password    | randomPassword           |
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "Invalid display name"

  Scenario: Sign Up with to long name return an error
    Given user with email "tooLongUserName@domain.com" not exist
    When I send a POST request to "/api/signup" with json body:
      | displayName | 5GscFWJ7d9RbXrZKvA2gQBaPzVq8NmuCn3wYLDtpeyEixO6TkMfHhU0IoSl1j4PEV5GscFWJ7d9RbXrZKvBaPzVq8NmuCn3wYLDtpNmuCn3wYLDtpeyEixO6TFWJ7d9Rb |
      | email       | tooLongUserName@domain.com |
      | password    | randomPassword             |
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "Invalid display name"
