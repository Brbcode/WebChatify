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
    And the JSON node 'root[1].sender.id' should be equal to "01GZC0AK7MHST8YEDB185ZWQ0E"
    And the JSON node 'root[1].sender.displayName' should be equal to "Chat Owner User"
    And the JSON node 'root[1].sender.email' should not exist
    And the JSON node 'root[1].content' should be equal to "Hello World!"

  Scenario: Participant get all messages from chatroom
    Given I am logged with "testParcitipant@domain.com" and "password"
    When user send a "GET" request to "/api/messages/chat/d6af44ed-1a6d-4c45-b8be-b880cee13b10"
    Then the response status code should be 200
    And the JSON node 'root' should have 2 element
    And the JSON node 'root[1].id' should be equal to "e4eefeba-9e27-460b-9cfd-b3954b618b65"
    And the JSON node 'root[1].createdAt' should exist
    And the JSON node 'root[1].sender.id' should be equal to "01GZC0AK7MHST8YEDB185ZWQ0E"
    And the JSON node 'root[1].sender.displayName' should be equal to "Chat Owner User"
    And the JSON node 'root[1].sender.email' should not exist
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
    Then the JSON node "sender.id" should be equal to "01GZC0AK7MHST8YEDB185ZWQ0E"
    And the JSON node "sender.displayName" should be equal to "Chat Owner User"
    And the JSON node "sender.email" should not exist
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
    Then the JSON node "sender.id" should be equal to "01GZBRB9CBKTQ33T6A15JGRPDR"
    And the JSON node "sender.displayName" should be equal to "Participant User"
    And the JSON node "sender.email" should not exist
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

  Scenario: Owner get specific message
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "GET" request to "/api/message/e4eefeba-9e27-460b-9cfd-b3954b618b65"
    Then the response status code should be 200
    And the JSON node "id" should be equal to "e4eefeba-9e27-460b-9cfd-b3954b618b65"
    And the JSON node "sender.id" should be equal to "01GZC0AK7MHST8YEDB185ZWQ0E"
    And the JSON node "sender.displayName" should be equal to "Chat Owner User"
    And the JSON node "sender.email" should not exist
    And the JSON node "chatroom" should be equal to "d6af44ed-1a6d-4c45-b8be-b880cee13b10"
    And the JSON node "createdAt" should exist
    And the JSON node "editAt" should not exist
    And the JSON node "content" should be equal to "Hello World!"

  Scenario: Participant get specific message
    Given I am logged with "testParcitipant@domain.com" and "password"
    When user send a "GET" request to "/api/message/e4eefeba-9e27-460b-9cfd-b3954b618b65"
    Then the response status code should be 200
    And the JSON node "id" should be equal to "e4eefeba-9e27-460b-9cfd-b3954b618b65"
    And the JSON node "sender.id" should be equal to "01GZC0AK7MHST8YEDB185ZWQ0E"
    And the JSON node "sender.displayName" should be equal to "Chat Owner User"
    And the JSON node "sender.email" should not exist
    And the JSON node "chatroom" should be equal to "d6af44ed-1a6d-4c45-b8be-b880cee13b10"
    And the JSON node "createdAt" should exist
    And the JSON node "editAt" should not exist
    And the JSON node "content" should be equal to "Hello World!"

  Scenario: User get specific message
    Given I am logged with "example@domain.com" and "plainPassword"
    When user send a "GET" request to "/api/message/e4eefeba-9e27-460b-9cfd-b3954b618b65"
    Then the response status code should be 401
    And the JSON node "code" should be equal to 401
    And the JSON node "message" should be equal to "Permission denied"

  Scenario: Try get specific message without login
    When I send a "GET" request to "/api/message/e4eefeba-9e27-460b-9cfd-b3954b618b65"
    Then the response status code should be 401
    And the JSON node "code" should be equal to 401
    And the JSON node "message" should be equal to "Permission denied"

  Scenario: Owner get specific edited message
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "GET" request to "/api/message/74b0c719-0b8a-4784-a3ab-0f2bbfedf8ed"
    Then the response status code should be 200
    And the JSON node "id" should be equal to "74b0c719-0b8a-4784-a3ab-0f2bbfedf8ed"
    And the JSON node "sender.id" should be equal to "01GZC0AK7MHST8YEDB185ZWQ0E"
    And the JSON node "sender.displayName" should be equal to "Chat Owner User"
    And the JSON node "sender.email" should not exist
    And the JSON node "chatroom" should be equal to "d6af44ed-1a6d-4c45-b8be-b880cee13b10"
    And the JSON node "createdAt" should exist
    And the JSON node "editAt" should exist
    And the JSON node "content" should be equal to "Edited Message!"

  Scenario: Owner get specific message
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "GET" request to "/api/message/invalid-id"
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "Message not found"

  Scenario: Admin get all records from message
    Given I am logged with "testAdmin@domain.com" and "password"
    When user send a "GET" request to "/api/message/records/74b0c719-0b8a-4784-a3ab-0f2bbfedf8ed"
    Then the response status code should be 200
    And the JSON node "root" should have 1 element
    And the JSON node "root[0].editAt" should exist
    And the JSON node "root[0].editor.id" should be equal to "01GZC0AK7MHST8YEDB185ZWQ0E"
    And the JSON node "root[0].editor.displayName" should be equal to "Chat Owner User"
    And the JSON node "root[0].editor.email" should not exist
    And the JSON node "root[0].from" should be equal to "Hello World!"
    And the JSON node "root[0].to" should be equal to "Edited Message!"

  Scenario: Owner get all records from own message
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "GET" request to "/api/message/records/74b0c719-0b8a-4784-a3ab-0f2bbfedf8ed"
    Then the response status code should be 401
    And the JSON node "code" should be equal to 401
    And the JSON node "message" should be equal to "Permission denied"

  Scenario: Participant get all records from message
    Given I am logged with "testParcitipant@domain.com" and "password"
    When user send a "GET" request to "/api/message/records/74b0c719-0b8a-4784-a3ab-0f2bbfedf8ed"
    Then the response status code should be 401
    And the JSON node "code" should be equal to 401
    And the JSON node "message" should be equal to "Permission denied"

  Scenario: User get all records from message
    Given I am logged with "example@domain.com" and "plainPassword"
    When user send a "GET" request to "/api/message/records/74b0c719-0b8a-4784-a3ab-0f2bbfedf8ed"
    Then the response status code should be 401
    And the JSON node "code" should be equal to 401
    And the JSON node "message" should be equal to "Permission denied"

  Scenario: Try get all records from message without be logged
    When I send a "GET" request to "/api/message/records/74b0c719-0b8a-4784-a3ab-0f2bbfedf8ed"
    Then the response status code should be 401
    And the JSON node "code" should be equal to 401
    And the JSON node "message" should be equal to "Permission denied"

  Scenario: Admin get all records from message
    Given I am logged with "testAdmin@domain.com" and "password"
    When user send a "GET" request to "/api/message/records/invalid-id"
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "Message not found"

  Scenario: Owner edit own specific message
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "PATCH" request to "/api/message/74b0c719-0b8a-4784-a3ab-0f2bbfedf8ed" with json body:
      | content | Hello World!! |
    Then the response status code should be 200
    And the JSON node 'id' should be equal to "74b0c719-0b8a-4784-a3ab-0f2bbfedf8ed"
    And the JSON node 'createdAt' should exist
    And the JSON node 'editAt' should exist
    And the JSON node 'sender.id' should be equal to "01GZC0AK7MHST8YEDB185ZWQ0E"
    And the JSON node 'content' should be equal to "Hello World!!"

  Scenario: Participants edit specific message
    Given I am logged with "testParcitipant@domain.com" and "password"
    When user send a "PATCH" request to "/api/message/74b0c719-0b8a-4784-a3ab-0f2bbfedf8ed" with json body:
      | content | Hello World!! |
    Then the response status code should be 401
    And the JSON node "code" should be equal to 401
    And the JSON node "message" should be equal to "Permission denied"

  Scenario: Try edit own specific message without be logged
    When I send a "PATCH" request to "/api/message/74b0c719-0b8a-4784-a3ab-0f2bbfedf8ed" with json body:
      | content | Hello World!! |
    Then the response status code should be 401
    And the JSON node "code" should be equal to 401
    And the JSON node "message" should be equal to "Permission denied"

  Scenario: Owner edit own specific invalid message
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "PATCH" request to "/api/message/invalid-if" with json body:
      | content | Hello World!! |
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "Message not found"

  Scenario: Owner edit own specific message to empty content
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "PATCH" request to "/api/message/74b0c719-0b8a-4784-a3ab-0f2bbfedf8ed" with json body:
      | content |  |
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "Empty content are not allowed"

  Scenario: Owner edit own specific message without body
    Given I am logged with "chatOwner@domain.com" and "password"
    When user send a "PATCH" request to "/api/message/74b0c719-0b8a-4784-a3ab-0f2bbfedf8ed"
    Then the response status code should be 400
    And the JSON node "code" should be equal to 400
    And the JSON node "message" should be equal to "Empty content are not allowed"