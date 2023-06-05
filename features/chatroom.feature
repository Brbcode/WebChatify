Feature:
  In order to prove that the ChatRoom api works correctly
  As a user
  I want to be able

  Scenario: Get users ChatRooms
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "GET" request to "/api/chat"
    Then the response status code should be 200
    Then the JSON node "root" should have 3 elements
    Then the JSON node "root[0].id" should exist
    Then the JSON node "root[0].owner.id" should be equal to "01GZC0AK7MHST8YEDB185ZWQ0E"
    Then the JSON node "root[0].owner.displayName" should be equal to "Chat Owner User"
    Then the JSON node "root[0].title" should exist
    Then the JSON node "root[0].createdAt" should exist
    Then the JSON node "root[0].participants" should exist

  Scenario: Get users ChatRooms without be logged
    When I send a "POST" request to "/api/chat"
    Then the response status code should be 401
    And the JSON node "code" should be equal to 401
    And the JSON node "message" should be equal to "Permission denied"

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

  Scenario: User join ChatRoom
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "POST" request to "/api/join/chat" with json body:
    | user     | 01GZBZZHZ5CEMTP0MRNZ04D3RE           |
    | chatroom | 35afea23-ec2a-4d26-977b-9240b6bdfdb9 |
    Then the response status code should be 200
    And the JSON node "id" should be equal to "35afea23-ec2a-4d26-977b-9240b6bdfdb9"
    And the JSON node "title" should be equal to "Test Join Chat"
    And the JSON node "createdAt" should exist
    And the JSON node "owner.id" should exist
    And the JSON node "owner.email" should not exist
    And the JSON node "owner.roles" should not exist
    And the JSON node "owner.displayName" should be equal to "Chat Owner User"
    And the JSON node "participants" should have 2 elements
    And the JSON node "participants[0].id" should be equal to "01GZC0AK7MHST8YEDB185ZWQ0E"
    And the JSON node "participants[0].displayName" should be equal to "Chat Owner User"
    And the JSON node "participants[0].email" should not exist
    And the JSON node "participants[0].roles" should not exist
    And the JSON node "participants[1].id" should be equal to "01GZBZZHZ5CEMTP0MRNZ04D3RE"
    And the JSON node "participants[1].displayName" should be equal to "Participant User 1"
    And the JSON node "participants[1].email" should not exist
    And the JSON node "participants[1].roles" should not exist

  Scenario: User join ChatRoom without logged
    When I send a "POST" request to "/api/join/chat" with json body:
      | user     | 01GZBZZHZ5CEMTP0MRNZ04D3RE           |
      | chatroom | 35afea23-ec2a-4d26-977b-9240b6bdfdb9 |
    Then the response status code should be 401
    And the JSON node "code" should be equal to 401
    And the JSON node "message" should be equal to "Permission denied"

  Scenario: User join ChatRoom bad request user not found
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "POST" request to "/api/join/chat" with json body:
      | chatroom | 35afea23-ec2a-4d26-977b-9240b6bdfdb9 |
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "Bad Request"

  Scenario: User join ChatRoom bad request chatroom not found
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "POST" request to "/api/join/chat" with json body:
      | user     | 01GZBZZHZ5CEMTP0MRNZ04D3RE           |
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "Bad Request"

  Scenario: User join ChatRoom bad request chatroom not found
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "POST" request to "/api/join/chat" with json body:
      | user     |                                      |
      | chatroom | 35afea23-ec2a-4d26-977b-9240b6bdfdb9 |
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "User or Chatroom not found"

  Scenario: User join ChatRoom bad request chatroom not found
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "POST" request to "/api/join/chat" with json body:
      | user     | 01GZBZZHZ5CEMTP0MRNZ04D3RE |
      | chatroom |                            |
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "User or Chatroom not found"

  Scenario: Not Owner try User join ChatRoom
    Given I am logged with "example@domain.com" and "plainPassword"
    When user send a "POST" request to "/api/join/chat" with json body:
      | user     | 01GZBZZHZ5CEMTP0MRNZ04D3RE           |
      | chatroom | 35afea23-ec2a-4d26-977b-9240b6bdfdb9 |
    Then the response status code should be 401
    And the JSON node "code" should be equal to 401
    And the JSON node "message" should be equal to "Permission denied"

  Scenario: Owner join to own ChatRoom
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "POST" request to "/api/join/chat" with json body:
      | user     | 01GZC0AK7MHST8YEDB185ZWQ0E           |
      | chatroom | 35afea23-ec2a-4d26-977b-9240b6bdfdb9 |
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "Owner can't join to own chat"