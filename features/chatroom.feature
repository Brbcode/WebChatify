Feature:
  In order to prove that the ChatRoom api works correctly
  As a user
  I want to be able

  Scenario: Create ChatRoom with too long title return error
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "POST" request to "/api/chat/newChat"
    Then the response status code should be 200
    And the JSON node "id" should exist
    And the JSON node "title" should be equal to "newChat"
    And the JSON node "createdAt" should exist
    And the JSON node "owner.id" should be equal to "01GZC0AK7MHST8YEDB185ZWQ0E"
    And the JSON node "owner.email" should not exist
    And the JSON node "owner.roles" should not exist
    And the JSON node "owner.displayName" should be equal to "Chat Owner User"
    And the JSON node "participants" should have 1 element
    And the JSON node "participants[0].id" should be equal to "01GZC0AK7MHST8YEDB185ZWQ0E"
    And the JSON node "participants[0].displayName" should be equal to "Chat Owner User"
    And the JSON node "participants[0].joinAt" should exist
    And the JSON node "participants[0].email" should not exist
    And the JSON node "participants[0].roles" should not exist

  Scenario: Create ChatRoom without be logged
    When I send a "POST" request to "/api/chat/newChat"
    Then the response status code should be 401
    And the JSON node "code" should be equal to 401
    And the JSON node "message" should be equal to "Permission denied"

  Scenario: Create ChatRoom with empty title return error
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "POST" request to "/api/chat/"
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "Invalid title"

  Scenario: Create ChatRoom with too long title return error
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "POST" request to "/api/chat/5GscFWJ7d9RbXrZKvA2gQBaPzVq8NmuCn3wYLDtpeyEixO6TkMfHhU0IoSl1j4PEV5GscFWJ7d9RbXrZKvBaPzVq8NmuCn3wYLDtpNmuCn3wYLDtpeyEixO6TFWJ7d9Rb"
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "Invalid title"

