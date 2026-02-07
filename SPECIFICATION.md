Kudos System Specification
Functional Requirements
User Stories
Selection: As a user, I can select another user from a searchable dropdown list of colleagues.
Creation: As a user, I can write a message of appreciation (max 500 characters).
Submission: As a user, I can submit the kudos to be stored and displayed publicly.
Feed: As a user, I can view a real-time feed of recent kudos on the dashboard.
Moderation (Admin): As an administrator, I can hide or delete inappropriate kudos messages from the feed.
Acceptance Criteria
Input Validation: Messages cannot be empty or exceed 500 characters.
Privacy: Users cannot give kudos to themselves.
Admin Control: Hidden kudos must immediately disappear from the public feed but remain in the DB for audit.
Responsiveness: The UI must be fully functional on mobile and desktop.
Technical Design
Database Schema (Proposed)
Table
Field
Type
Description
Users
id, name, role, email
UUID/String
Employee information
Kudos
id
UUID
Primary key
Kudos
sender_id
UUID
FK to Users
Kudos
receiver_id
UUID
FK to Users
Kudos
message
Text
Max 500 chars
Kudos
created_at
Timestamp
Default: now()
Kudos
is_visible
Boolean
Default: true (For moderation)
Kudos
moderated_by
UUID
Admin user ID
Kudos
moderated_at
Timestamp
When hidden/deleted

Frontend Components
App: Main container and state management.
KudosForm: Selection logic and text input.
KudosFeed: Displaying the list of visible kudos.
AdminPanel: Moderation controls for users with the 'admin' role.
Implementation Plan
Setup React and Tailwind CSS environment.
Create mock user data and initial state.
Build the KudosForm with character counting and validation.
Build the KudosFeed with "Visible Only" filtering.
Implement the AdminPanel toggle logic for is_visible.
