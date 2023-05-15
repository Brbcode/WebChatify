Feature:
  In order to prove that the Message api works correctly
  As a user
  I want to be able

  Scenario: Owner get all messages from chatroom
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "GET" request to "/api/messages/chat/d6af44ed-1a6d-4c45-b8be-b880cee13b10"
    Then the response status code should be 200
    And the JSON node 'root' should have 2 element
    And the JSON node 'root[1].id' should be equal to "e4eefeba-9e27-460b-9cfd-b3954b618b65"
    And the JSON node 'root[1].createdAt' should exist
    And the JSON node 'root[1].sender' should be equal to "01GZC0AK7MHST8YEDB185ZWQ0E"
    And the JSON node 'root[1].content' should be equal to "Hello World!"

  Scenario: Participant get all messages from chatroom
    Given I am logged with "testParcitipant@domain.com" and "password"
    When user send a "GET" request to "/api/messages/chat/d6af44ed-1a6d-4c45-b8be-b880cee13b10"
    Then the response status code should be 200
    And the JSON node 'root' should have 2 element
    And the JSON node 'root[1].id' should be equal to "e4eefeba-9e27-460b-9cfd-b3954b618b65"
    And the JSON node 'root[1].createdAt' should exist
    And the JSON node 'root[1].sender' should be equal to "01GZC0AK7MHST8YEDB185ZWQ0E"
    And the JSON node 'root[1].content' should be equal to "Hello World!"

  Scenario: User try get all messages from not joined chatroom
    Given I am logged with "example@domain.com" and "plainPassword"
    When user send a "GET" request to "/api/messages/chat/d6af44ed-1a6d-4c45-b8be-b880cee13b10"
    Then the response status code should be 401
    Then the JSON node "code" should be equal to 401
    Then the JSON node "message" should be equal to "Permission denied"

  Scenario: Try get all messages from not chatroom when I am not logged
    When I send a "GET" request to "/api/messages/chat/d6af44ed-1a6d-4c45-b8be-b880cee13b10"
    Then the response status code should be 401
    Then the JSON node "code" should be equal to 401
    Then the JSON node "message" should be equal to "Permission denied"

  Scenario: Owner get all messages from not valid chatroom
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "GET" request to "/api/messages/chat/not-valid-chatroom"
    Then the response status code should be 400
    Then the JSON node "code" should be equal to 400
    Then the JSON node "message" should be equal to "Chatroom not found"

  Scenario: Owner send a message to own chatroom
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "POST" request to "/api/message" with json body:
      | chatroom | d6af44ed-1a6d-4c45-b8be-b880cee13b10 |
      | content  | Example content                      |
    Then the response status code should be 200
    Then the JSON node "sender" should be equal to "01GZC0AK7MHST8YEDB185ZWQ0E"
    Then the JSON node "chatroom" should be equal to "d6af44ed-1a6d-4c45-b8be-b880cee13b10"
    Then the JSON node "createdAt" should exist
    Then the JSON node "editAt" should not exist
    Then the JSON node "content" should be equal to "Example content"

  Scenario: Participant send a message to joined chatroom
    Given I am logged with "testParcitipant@domain.com" and "password"
    When user send a "POST" request to "/api/message" with json body:
      | chatroom | d6af44ed-1a6d-4c45-b8be-b880cee13b10 |
      | content  | Example content                      |
    Then the response status code should be 200
    Then the JSON node "sender" should be equal to "01GZBRB9CBKTQ33T6A15JGRPDR"
    Then the JSON node "chatroom" should be equal to "d6af44ed-1a6d-4c45-b8be-b880cee13b10"
    Then the JSON node "createdAt" should exist
    Then the JSON node "editAt" should not exist
    Then the JSON node "content" should be equal to "Example content"

  Scenario: Participant send a message to not joined chatroom
    Given I am logged with "example@domain.com" and "plainPassword"
    When user send a "POST" request to "/api/message" with json body:
      | chatroom | d6af44ed-1a6d-4c45-b8be-b880cee13b10 |
      | content  | Example content                      |
    Then the response status code should be 401
    Then the JSON node "code" should be equal to 401
    Then the JSON node "message" should be equal to "Permission denied"

  Scenario: Participant send a message to not joined chatroom
    When I send a "POST" request to "/api/message" with json body:
      | chatroom | d6af44ed-1a6d-4c45-b8be-b880cee13b10 |
      | content  | Example content                      |
    Then the response status code should be 401
    Then the JSON node "code" should be equal to 401
    Then the JSON node "message" should be equal to "Permission denied"

  Scenario: Send a message with missing chatroom
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "POST" request to "/api/message" with json body:
      | content  | Example content                      |
    Then the response status code should be 400
    Then the JSON node "code" should be equal to 400
    Then the JSON node "message" should be equal to "Bad Request"

  Scenario: Send a message with missing content
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "POST" request to "/api/message" with json body:
      | chatroom | d6af44ed-1a6d-4c45-b8be-b880cee13b10 |
    Then the response status code should be 400
    Then the JSON node "code" should be equal to 400
    Then the JSON node "message" should be equal to "Bad Request"

  Scenario: Send a message with missing content
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "POST" request to "/api/message" with json body:
      | chatroom | not-valid-id    |
      | content  | Example content |
    Then the response status code should be 400
    Then the JSON node "code" should be equal to 400
    Then the JSON node "message" should be equal to "Chatroom not found"